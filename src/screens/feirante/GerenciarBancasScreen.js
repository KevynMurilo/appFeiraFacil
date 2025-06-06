import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../config/api';

export default function GerenciarBancasScreen() {
  const navigation = useNavigation();
  const [feiras, setFeiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarFeiras = async () => {
    try {
      setCarregando(true);

      const usuarioId = await AsyncStorage.getItem('usuarioId');
      const token = await AsyncStorage.getItem('token');
      if (!usuarioId || !token) return;

      const response = await axios.get(`${API_URL}/feiras/com-banca/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = response.data;
      setFeiras(res.success && res.data ? res.data : []);
    } catch (err) {
      console.error('Erro ao buscar feiras registradas:', err);
      Alert.alert('Erro', 'Não foi possível carregar as feiras.');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { carregarFeiras(); }, []));
  const onRefresh = useCallback(() => { setRefreshing(true); carregarFeiras(); }, []);

  const avisosStatus = {
    INATIVO: {
      cor: '#aaa',
      icone: 'alert-circle-outline',
      texto: 'Este feirante está inativo.',
    },
    SUBSTITUIDO_POR_FALTAS: {
      cor: '#f44336',
      icone: 'warning-outline',
      texto: 'Este feirante foi substituído por faltas.',
    },
    AGUARDANDO_REVISÃO: {
      cor: '#ff9800',
      icone: 'time-outline',
      texto: 'Justificativa aguardando revisão.',
    },
    BLOQUEADO: {
      cor: '#d32f2f',
      icone: 'close-circle-outline',
      texto: 'Acesso bloqueado por irregularidades.',
    },
    NA_FILA_DE_ESPERA: {
      cor: '#2196f3',
      icone: 'ellipsis-horizontal-circle-outline',
      texto: 'Você está na fila de espera desta feira.',
    },
  };

  const renderFeira = ({ feira, feirante }) => {
    const banca = feirante?.bancas?.find((b) => b.nomeFeira === feira.nome);
    const aviso = feirante?.status ? avisosStatus[feirante.status] : null;

    return (
      <View key={feira.id} style={styles.card}>
        {aviso && (
          <View style={[styles.avisoContainer, { backgroundColor: aviso.cor }]}>
            <Ionicons name={aviso.icone} size={18} color="#fff" />
            <Text style={styles.avisoTexto}>{aviso.texto}</Text>
          </View>
        )}

        <Text style={styles.nomeFeira}>{feira.nome}</Text>
        <Text style={styles.local}>🗺️ {feira.local}</Text>

        {banca?.horarios?.length > 0 ? (
          banca.horarios.map((h) => (
            <View key={h.id} style={styles.horarioBox}>
              <Text style={styles.horarioTexto}>
                🗓 {h.dia} | ⏰ {h.horarioInicio} - {h.horarioFim}
              </Text>
              <Text style={styles.horarioSub}>
                Feirantes: {h.quantidadeFeirantes}/{h.maxFeirantes} | Fila: {h.quantidadeFilaDeEspera}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.horarioAviso}>⚠️ Nenhum horário cadastrado.</Text>
        )}

        {feira.statusFila !== 'ATIVO' && feira.posicaoFila && (
          <Text style={styles.fila}>📋 Posição na fila: {feira.posicaoFila}</Text>
        )}

        {banca && (
          <>
            <Text style={styles.bancaTitulo}>🧺 Minha Banca</Text>
            <Text style={styles.info}>Tipo: {banca.tipoProduto}</Text>
            {banca.produtos?.length > 0 && (
              <Text style={styles.info}>Produtos: {banca.produtos.join(', ')}</Text>
            )}

            <TouchableOpacity
              style={styles.botaoInterno}
              onPress={() => navigation.navigate('VerMinhaBanca', { bancaId: banca.id })}
            >
              <Text style={styles.botaoInternoTexto}>Ver Detalhes</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.acoesContainer}>
        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => navigation.navigate('CadastrarBanca')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#00AEEF" />
          <Text style={styles.botaoNovoTexto}>Nova Banca</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
        }
      >
        {carregando && !refreshing ? (
          <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 50 }} />
        ) : feiras.length > 0 ? (
          feiras.map(renderFeira)
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#555' }}>
            Nenhuma feira registrada encontrada.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  acoesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  botaoNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  botaoNovoTexto: {
    marginLeft: 6,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  container: { padding: 20, paddingTop: 10 },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  avisoContainer: {
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avisoTexto: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  nomeFeira: { fontSize: 18, fontWeight: 'bold', color: '#004AAD' },
  local: { fontSize: 14, color: '#333', marginBottom: 6 },
  info: { fontSize: 14, color: '#444', marginBottom: 3 },
  fila: { fontSize: 14, marginTop: 8, color: '#f90' },
  bancaTitulo: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  botaoInterno: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
  },
  botaoInternoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  horarioBox: {
    backgroundColor: '#E9F1FF',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  horarioTexto: {
    fontSize: 14,
    color: '#004AAD',
    fontWeight: '600',
  },
  horarioSub: {
    fontSize: 13,
    color: '#333',
  },
  horarioAviso: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 6,
  },
});

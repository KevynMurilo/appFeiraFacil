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
  const [faltasAtivas, setFaltasAtivas] = useState([]);

  const carregarFeiras = async () => {
    try {
      setCarregando(true);
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      const token = await AsyncStorage.getItem('token');
      if (!usuarioId || !token) return;

      const response = await axios.get(`${API_URL}/feiras/com-banca/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const faltasResponse = await axios.get(`${API_URL}/faltas/feirante/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const faltas = faltasResponse.data.success ? faltasResponse.data.data : [];
      setFaltasAtivas(faltas.filter(f => !f.statusJustificativa));

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

  const renderFeira = ({ feira, feirante }) => {
    const bancas = feirante?.bancas?.filter((b) => b.nomeFeira === feira.nome) || [];

    return (
      <View key={feira.id} style={styles.card}>
        <Text style={styles.nomeFeira}>{feira.nome}</Text>
        <Text style={styles.local}>🗽️ {feira.local}</Text>

        {bancas.length > 0 ? (
          bancas.map((banca) => (
            <View key={banca.id} style={styles.bancaBox}>
              <Text style={styles.bancaTitulo}>🧺 Tipo: {banca.tipoProduto}</Text>
              {banca.produtos?.length > 0 && (
                <Text style={styles.info}>Produtos: {banca.produtos.join(', ')}</Text>
              )}

              {banca.horarios.map((h) => {
                const temFalta = faltasAtivas.some(f => f.idHorario === h.id);

                return (
                  <View key={h.id} style={styles.horarioBox}>
                    <Text style={styles.horarioTexto}>🗓 {h.dia} | ⏰ {h.horarioInicio} - {h.horarioFim}</Text>
                    <Text style={styles.horarioSub}>
                      Feirantes: {h.quantidadeFeirantes}/{h.maxFeirantes} | Fila: {h.quantidadeFilaDeEspera}
                    </Text>
                    {h.statusBanca === 'NA_FILA_DE_ESPERA' && (
                      <Text style={styles.fila}>📋 Você está na fila deste horário</Text>
                    )}
                    {temFalta && (
                      <Text style={styles.faltaAtiva}>⚠️ Falta pendente neste horário</Text>
                    )}

                    <TouchableOpacity
                      style={styles.botaoInterno}
                      onPress={() =>
                        navigation.navigate('VerMinhaBanca', {
                          bancaId: banca.id,
                          horarioId: h.id,
                        })
                      }
                    >
                      <Text style={styles.botaoInternoTexto}>Ver Detalhes</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))
        ) : (
          <Text style={styles.horarioAviso}>⚠️ Nenhuma banca cadastrada nesta feira.</Text>
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
  nomeFeira: { fontSize: 18, fontWeight: 'bold', color: '#004AAD' },
  local: { fontSize: 14, color: '#333', marginBottom: 6 },
  info: { fontSize: 14, color: '#444', marginBottom: 3 },
  fila: { fontSize: 14, marginTop: 4, color: '#f90' },
  faltaAtiva: { fontSize: 13, marginTop: 4, color: '#FFA500', fontWeight: 'bold' },
  bancaTitulo: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  bancaBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dce6ff',
  },
  botaoInterno: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 8,
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
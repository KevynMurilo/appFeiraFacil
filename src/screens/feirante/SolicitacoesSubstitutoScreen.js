import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SolicitacoesSubstitutoScreen() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = async () => {
    try {
      setCarregando(true);
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      const token = await AsyncStorage.getItem('token');

      if (!usuarioId || !token) {
        Alert.alert('Erro', 'Token ou usuário não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.get(
        `http://192.168.18.17:8080/api/solicitacar-substitutos/recebidas/${usuarioId}?status=PENDENTE`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = response.data;
      if (res.success && res.data) {
        setSolicitacoes(res.data);
      } else {
        setSolicitacoes([]);
        Alert.alert('Atenção', res.message || 'Nenhuma solicitação pendente encontrada.');
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      Alert.alert('Erro', 'Não foi possível carregar as solicitações.');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarSolicitacoes();
  }, []);

  const responderSolicitacao = async (id, acao) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado.');
        return;
      }

      const url = `http://192.168.18.17:8080/api/solicitacar-substitutos/${id}/${acao}`;
      const response = await axios.patch(url, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = response.data;
      if (res.success) {
        Alert.alert('Sucesso', res.message);
        setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      } else {
        Alert.alert('Erro', res.message || 'Falha ao processar solicitação.');
      }
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      Alert.alert('Erro', 'Erro ao tentar aceitar ou recusar.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
        }
      >
        {carregando && !refreshing ? (
          <ActivityIndicator size="large" color="#004AAD" />
        ) : solicitacoes.length === 0 ? (
          <Text style={styles.textoVazio}>Nenhuma solicitação pendente.</Text>
        ) : (
          solicitacoes.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.nome}>
                Titular: <Text style={styles.destaque}>{item.nomeTitular || 'Desconhecido'}</Text>
              </Text>
              <Text style={styles.status}>Status: {item.status}</Text>

              <View style={styles.acoes}>
                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: '#4CAF50' }]}
                  onPress={() => responderSolicitacao(item.id, 'aceitar')}
                >
                  <Text style={styles.botaoTexto}>✅ Aceitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, { backgroundColor: '#FF4D4D' }]}
                  onPress={() => responderSolicitacao(item.id, 'recusar')}
                >
                  <Text style={styles.botaoTexto}>❌ Recusar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    marginBottom: 6,
  },
  destaque: {
    fontWeight: 'bold',
    color: '#004AAD',
  },
  status: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botao: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
    marginTop: 30,
  },
});

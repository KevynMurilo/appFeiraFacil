import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function GerenciarSubstitutosScreen() {
  const navigation = useNavigation();
  const [titulares, setTitulares] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const carregarTitulares = async () => {
    setCarregando(true);
    setErro('');

    try {
      const substitutoId = await AsyncStorage.getItem('usuarioId');
      if (!substitutoId) {
        setErro('Usuário não identificado.');
        setCarregando(false);
        return;
      }

      const response = await axios.get(
        `http://192.168.18.17:8080/api/substitutos/substituto/${substitutoId}`
      );
      const res = response.data;

      if (res.success && res.data) {
        setTitulares(res.data);
      } else {
        setErro(res.message || 'Erro ao buscar titulares.');
      }
    } catch (e) {
      console.error('Erro ao buscar titulares:', e);
      setErro('Erro na comunicação com o servidor.');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarTitulares();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarTitulares();
  }, []);

  const removerVinculo = (id) => {
    Alert.alert(
      'Remover Vínculo',
      'Deseja realmente desfazer o vínculo com esse titular?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.put(
                `http://192.168.18.17:8080/api/substitutos/${id}/cancelar`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const res = response.data;

              if (res.success) {
                setTitulares((prev) => prev.filter((v) => v.id !== id));
                Alert.alert('Sucesso', 'Vínculo removido com sucesso.');
              } else {
                Alert.alert('Erro', res.message || 'Falha ao remover vínculo.');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Erro', 'Erro ao se comunicar com o servidor.');
            }
          },
        },
      ]
    );
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return '—';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.acoesContainer}>
        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => navigation.navigate('Solicitar-Substituto')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#00AEEF" />
          <Text style={styles.botaoNovoTexto}>Novo Substituto</Text>
        </TouchableOpacity>
      </View>

      {carregando && !refreshing ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
          }
        >
          {erro !== '' && <Text style={styles.alertaErro}>❌ {erro}</Text>}

          {titulares.length === 0 && erro === '' && (
            <Text style={styles.nenhumTexto}>Você ainda não está substituindo ninguém.</Text>
          )}

          {titulares.map((t) => (
            <View key={t.id} style={styles.card}>
              <View style={styles.topoCard}>
                <Ionicons name="person-circle" size={32} color="#004AAD" />
                <View>
                  <Text style={styles.nomeTitular}>{t.nomeTitular}</Text>
                  <Text style={styles.substituto}>🔁 Substituindo: {t.nomeSubstituto}</Text>
                </View>
              </View>
              <Text style={styles.dado}>📅 Início: {formatarData(t.dataInicio)}</Text>
              <Text style={styles.dado}>📅 Fim: {formatarData(t.dataFim)}</Text>
              <Text style={styles.dado}>✅ Ativo: {t.ativo ? 'Sim' : 'Não'}</Text>

              <TouchableOpacity
                style={styles.botaoRemover}
                onPress={() => removerVinculo(t.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.botaoRemoverTexto}>Remover Vínculo</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  container: {
    padding: 20,
  },
  alertaErro: {
    backgroundColor: '#FFEBEB',
    color: '#D8000C',
    borderLeftWidth: 5,
    borderLeftColor: '#D8000C',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  nenhumTexto: {
    textAlign: 'center',
    color: '#777',
    marginTop: 30,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#004AAD',
  },
  topoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  nomeTitular: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  substituto: {
    fontSize: 14,
    color: '#777',
  },
  dado: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  botaoRemover: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  botaoRemoverTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

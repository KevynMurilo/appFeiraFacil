import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function SubstituirFeiranteScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feiranteId, horarioId } = route.params;

  const [feirante, setFeirante] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarFeirante = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/fila-espera/proximo-ativo?idHorario=${horarioId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setFeirante(res.data.data);
      } else {
        setFeirante(null);
      }
    } catch (error) {
      console.warn('Feirante ativo não encontrado ou erro de rede:', error?.response?.data || error.message);
      setFeirante(null);
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const substituirFeirante = async () => {
    Alert.alert(
      'Confirmar substituição',
      'Deseja realmente substituir este feirante pelo próximo da fila?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Substituir',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.post(
                `${API_URL}/fila-espera/substituir?idHorario=${horarioId}&idFeiranteInativo=${feiranteId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (response.data.success) {
                Alert.alert('Sucesso', response.data.message || 'Feirante substituído com sucesso!');
                navigation.goBack();
              } else {
                Alert.alert('Aviso', response.data.message || 'Não foi possível realizar a substituição.');
              }
            } catch (err) {
              console.error('Erro ao substituir:', err.response?.data || err.message || err);
              Alert.alert(
                'Erro',
                err.response?.data?.message || 'Erro ao substituir feirante. Tente novamente.'
              );
            }
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    buscarFeirante();
  }, []);

  useEffect(() => {
    buscarFeirante();
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!feirante) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Substituir Feirante" />
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.erro}>Nenhum feirante ativo na fila para substituição.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Substituir Feirante" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={24} color="#004AAD" />
            <Text style={styles.cardTitulo}>Informações do Feirante</Text>
          </View>

          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valor}>{feirante.nomeFeirante}</Text>

          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.valor}>{feirante.telefoneFeirante}</Text>

          <Text style={styles.label}>Status</Text>
          <Text style={styles.valor}>{feirante.status || 'EM_FILA'}</Text>

          <Text style={styles.label}>Descrição do Horário</Text>
          <Text style={styles.valor}>{feirante.descricaoHorario}</Text>

          <Text style={styles.label}>Data de Entrada na Fila</Text>
          <Text style={styles.valor}>
            {new Date(feirante.dataCriacao).toLocaleDateString('pt-BR')}
          </Text>

          <TouchableOpacity style={styles.botaoSubstituir} onPress={substituirFeirante}>
            <Text style={styles.botaoTexto}>Substituir por Próximo da Fila</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 30, flexGrow: 1 },
  card: {
    backgroundColor: '#F2F6FF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: '#004AAD',
  },
  valor: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  erro: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
    marginTop: 40,
  },
  botaoSubstituir: {
    backgroundColor: '#D32F2F',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

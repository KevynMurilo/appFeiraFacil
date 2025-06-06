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
import { API_URL } from '../../config/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function GerenciarFeirantesScreen() {
  const navigation = useNavigation();
  const [feirantes, setFeirantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState(null);

  const statusLabel = {
    ATIVO: 'Ativo',
    INATIVO: 'Inativo',
    SUBSTITUIDO_POR_FALTAS: 'Substituído',
    AGUARDANDO_REVISÃO: 'Aguardando revisão',
    BLOQUEADO: 'Bloqueado',
    NA_FILA_DE_ESPERA: 'Fila de espera',
  };

  const statusCor = {
    ATIVO: '#388E3C',
    INATIVO: '#757575',
    SUBSTITUIDO_POR_FALTAS: '#D32F2F',
    AGUARDANDO_REVISÃO: '#F9A825',
    BLOQUEADO: '#C62828',
    NA_FILA_DE_ESPERA: '#1976D2',
  };

  const carregarFeirantes = async (status = null) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = status
        ? `${API_URL}/feirantes?status=${status}`
        : `${API_URL}/feirantes`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFeirantes(response.data.data);
      } else {
        Alert.alert('Erro', response.data.message || 'Falha ao carregar feirantes');
      }
    } catch (error) {
      console.error('Erro ao carregar feirantes:', error);
      Alert.alert('Erro', 'Erro ao buscar feirantes do servidor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregarFeirantes(statusSelecionado);
    }, [statusSelecionado])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarFeirantes(statusSelecionado);
  };

  const renderFeirante = (feirante) => (
    <View key={feirante.id} style={styles.card}>
      <View style={styles.headerCard}>
        <Ionicons name="person-circle-outline" size={30} color="#004AAD" />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{feirante.nome}</Text>
          <Text style={styles.email}>{feirante.email}</Text>
        </View>
        <View
          style={[
            styles.statusTag,
            { backgroundColor: statusCor[feirante.status] || '#999' },
          ]}
        >
          <Text style={styles.statusTexto}>
            {statusLabel[feirante.status] || feirante.status}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.botaoInterno}
        onPress={() => navigation.navigate('VerDetalhesFeirante', { feiranteId: feirante.id })}
      >
        <Text style={styles.botaoInternoTexto}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFiltros = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroContainer}>
      <TouchableOpacity
        style={[
          styles.filtroBotao,
          statusSelecionado === null && styles.filtroAtivo,
        ]}
        onPress={() => setStatusSelecionado(null)}
      >
        <Text style={styles.filtroTexto}>Todos</Text>
      </TouchableOpacity>

      {Object.entries(statusLabel).map(([status, label]) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filtroBotao,
            statusSelecionado === status && styles.filtroAtivo,
          ]}
          onPress={() => setStatusSelecionado(status)}
        >
          <Text style={styles.filtroTexto}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
          }
        >
          {renderFiltros()}

          {feirantes.length > 0 ? (
            feirantes.map(renderFeirante)
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 30 }}>
              Nenhum feirante encontrado.
            </Text>
          )}
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
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 15,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  email: {
    fontSize: 13,
    color: '#555',
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
  filtroContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 5,
  },
  filtroBotao: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    marginRight: 10,
  },
  filtroAtivo: {
    backgroundColor: '#004AAD',
  },
  filtroTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

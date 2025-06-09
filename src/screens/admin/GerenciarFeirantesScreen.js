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
  TextInput,
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
  const [cpfBusca, setCpfBusca] = useState('');

  const statusLabel = {
    ATIVO: 'Ativo',
    BLOQUEADO: 'Bloqueado',
  };

  const statusCor = {
    ATIVO: '#388E3C',
    BLOQUEADO: '#C62828',
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

  const buscarPorCpf = async () => {
    const cpfLimpo = cpfBusca.replace(/\D/g, '');
    if (!cpfLimpo) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/feirantes/buscar?cpf=${cpfLimpo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFeirantes([res.data.data]);
      } else {
        Alert.alert('Erro', res.data.message || 'Feirante não encontrado.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'CPF não encontrado.');
    } finally {
      setLoading(false);
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
        <Ionicons name="person-circle-outline" size={40} color="#004AAD" />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{feirante.nome}</Text>
          <Text style={styles.email}>{feirante.email}</Text>
        </View>
        {feirante.status && (
          <View style={[styles.statusTag, { backgroundColor: statusCor[feirante.status] || '#999' }]}>
            <Text style={styles.statusTexto}>
              {statusLabel[feirante.status] || feirante.status}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.botaoVer}
        onPress={() => navigation.navigate('VerDetalhesFeirante', { feiranteId: feirante.id })}
      >
        <Ionicons name="eye-outline" size={16} color="#fff" />
        <Text style={styles.botaoTexto}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFiltros = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroContainer}>
      <TouchableOpacity
        style={[styles.filtroBotao, statusSelecionado === null && styles.filtroAtivo]}
        onPress={() => setStatusSelecionado(null)}
      >
        <Text style={styles.filtroTexto}>Todos</Text>
      </TouchableOpacity>
      {Object.entries(statusLabel).map(([status, label]) => (
        <TouchableOpacity
          key={status}
          style={[styles.filtroBotao, statusSelecionado === status && styles.filtroAtivo]}
          onPress={() => setStatusSelecionado(status)}
        >
          <Text style={styles.filtroTexto}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.barraBusca}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por CPF"
          value={cpfBusca}
          onChangeText={setCpfBusca}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.botaoBuscar} onPress={buscarPorCpf}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

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
  barraBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 42,
    borderColor: '#004AAD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#000',
  },
  botaoBuscar: {
    backgroundColor: '#004AAD',
    padding: 10,
    borderRadius: 10,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 17,
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
    borderRadius: 20,
  },
  statusTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  botaoVer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    gap: 6,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filtroContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
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

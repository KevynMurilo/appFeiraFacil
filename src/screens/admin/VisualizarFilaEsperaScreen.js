import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopoNavegacao from '../../components/TopoNavegacao';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config/api';

export default function VisualizarFilaEsperaScreen({ route }) {
  const { feira } = route.params;
  const [fila, setFila] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  const buscarFila = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/fila-espera/feira/${feira.id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      const res = response.data;
      if (res.success) {
        setFila(res.data);
      } else {
        setErro(res.message || 'Erro ao buscar fila');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao buscar fila de espera.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarFila();
  }, [feira]);

  const verDetalhes = (feiranteId, idFila) => {
    navigation.navigate('VerDetalhesFeirante', { feiranteId, idFila });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo={`Fila de Espera - ${feira.nome}`} />

      {carregando && fila.length === 0 ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 30 }} />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : fila.length === 0 ? (
        <Text style={styles.vazio}>Nenhum feirante na fila.</Text>
      ) : (
        <FlatList
          data={fila}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          refreshing={carregando}
          onRefresh={buscarFila}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>👤 {item.nomeFeirante}</Text>
              <Text style={styles.info}>📞 {item.telefoneFeirante}</Text>
              <Text style={styles.info}>📍 Posição: {item.posicao}</Text>
              <Text style={styles.info}>📌 Status: {item.status}</Text>

              <TouchableOpacity
                style={styles.botaoDetalhes}
                onPress={() => verDetalhes(item.feiranteId, item.id)}
              >
                <Text style={styles.botaoTexto}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#E6F7FD',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#004AAD',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  botaoDetalhes: {
    backgroundColor: '#00AEEF',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  vazio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

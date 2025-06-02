import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function FilaDeEsperaScreen() {
  const [feiras, setFeiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const carregarFeiras = async () => {
      try {
        const response = await axios.get('http://192.168.18.17:8080/api/feiras');
        const res = response.data;
        if (res.success) {
          setFeiras(res.data);
        } else {
          setErro(res.message || 'Erro ao carregar feiras');
        }
      } catch (err) {
        setErro('Erro ao buscar feiras.');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    carregarFeiras();
  }, []);

  const abrirFila = (feira) => {
    navigation.navigate('VisualizarFilaEspera', { feira });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitulo}>Selecione uma feira para ver sua fila de espera:</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          feiras.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => abrirFila(item)}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.info}>📍 {item.local}</Text>
              <Text style={styles.info}>🗓 {item.diasSemana} às {item.horario}</Text>
              <Text style={styles.info}>👥 {item.quantidadeFeirantes}/{item.maxFeirantes}</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 15,
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#004AAD',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

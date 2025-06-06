import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SelecionarFeiraFaltasScreen() {
  const [feiras, setFeiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const carregarFeiras = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(`${API_URL}/feiras`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  const abrirFaltosos = (feira) => {
    navigation.navigate('FeirantesComTresFaltas', { feiraId: feira.id });
  };

  const formatarHorarios = (horarios) => {
    return horarios
      .map((h) => `${h.dia}: ${h.horarioInicio} - ${h.horarioFim}`)
      .join('\n');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitulo}>Selecione uma feira para ver os feirantes com 3 faltas:</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          feiras.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => abrirFaltosos(item)}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.info}>
                <Text style={styles.label}>LOCAL:</Text> {item.local}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>HORÁRIOS:</Text>{'\n'}
                {formatarHorarios(item.horarios)}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>CAPACIDADE:</Text> {item.quantidadeFeirantes}/{item.maxFeirantes}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>FILA DE ESPERA:</Text> {item.quantidadeFilaDeEspera}
              </Text>
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
    color: '#004AAD',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
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

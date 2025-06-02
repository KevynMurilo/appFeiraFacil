import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function FeirantesComTresFaltasScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feiraId } = route.params;

  const [feirantes, setFeirantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarFeirantesComFaltas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `http://10.1.59.59:8080/api/faltas/com-tres-faltas/${feiraId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setFeirantes(res.data.data);
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao buscar feirantes com faltas.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao buscar feirantes com faltas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFeirantesComFaltas();
  }, []);

  const navegarParaDetalhes = (feiranteId) => {
    navigation.navigate('VerDetalhesFeirante', {
      feiranteId,
      idFila: null,
    });
  };

  const navegarParaJustificativas = (feiranteId) => {
    navigation.navigate('VerJustificativasFeirante', {
      feiranteId,
    });
  };

  return (
    <SafeAreaView style={styles.safe}> 
      <TopoNavegacao titulo="Feirantes com 3 Faltas" />

      {loading ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {feirantes.length > 0 ? (
            feirantes.map((feirante, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.nome}>{feirante.nome}</Text>
                <Text style={styles.cpf}>CPF: {feirante.cpf}</Text>
                <Text style={styles.faltas}>Faltas: {feirante.faltas}</Text>

                <TouchableOpacity
                  style={styles.botao}
                  onPress={() => navegarParaDetalhes(feirante.idFeirante)}
                >
                  <Text style={styles.botaoTexto}>Ver Detalhes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.botao, styles.botaoJustificativa]}
                  onPress={() => navegarParaJustificativas(feirante.idFeirante)}
                >
                  <Text style={styles.botaoTexto}>Ver Justificativas</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.nenhum}>Nenhum feirante com 3 faltas encontrado.</Text>
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
    padding: 20,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  cpf: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  faltas: {
    fontSize: 14,
    color: '#C00',
    marginTop: 5,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  botaoJustificativa: {
    backgroundColor: '#888',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nenhum: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
});

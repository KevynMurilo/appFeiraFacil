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
import { useRoute } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function VerJustificativasFeiranteScreen() {
  const route = useRoute();
  const { feiranteId } = route.params;

  const [justificativas, setJustificativas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarJustificativas = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `http://192.168.18.17:8080/api/justificativas/feirante/${feiranteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setJustificativas(res.data.data);
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao buscar justificativas.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao buscar justificativas.');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, aceita) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(
        `http://192.168.18.17:8080/api/justificativas/${id}/status?aceita=${aceita}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        Alert.alert('Sucesso', res.data.message);
        carregarJustificativas(); // recarrega a lista após atualização
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao atualizar status.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao atualizar status.');
    }
  };

  useEffect(() => {
    carregarJustificativas();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Justificativas de Falta" />

      {loading ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {justificativas.length > 0 ? (
            justificativas.map((justificativa, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.label}>Data da Falta:</Text>
                <Text style={styles.texto}>{justificativa.dataFalta}</Text>

                <Text style={styles.label}>Motivo:</Text>
                <Text style={styles.texto}>{justificativa.motivo}</Text>

                <Text style={styles.label}>Status:</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        justificativa.status === 'ACEITA'
                          ? 'green'
                          : justificativa.status === 'RECUSADA'
                          ? 'red'
                          : '#f39c12',
                    },
                  ]}
                >
                  {justificativa.status}
                </Text>

                {justificativa.status === 'PENDENTE' && (
                  <View style={styles.botoes}>
                    <TouchableOpacity
                      style={[styles.botao, { backgroundColor: '#4CAF50' }]}
                      onPress={() => atualizarStatus(justificativa.id, true)}
                    >
                      <Text style={styles.botaoTexto}>Aceitar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.botao, { backgroundColor: '#C62828' }]}
                      onPress={() => atualizarStatus(justificativa.id, false)}
                    >
                      <Text style={styles.botaoTexto}>Recusar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.nenhum}>Nenhuma justificativa encontrada.</Text>
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
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#004AAD',
    marginTop: 8,
  },
  texto: {
    fontSize: 14,
    color: '#333',
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  nenhum: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  botao: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 6,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

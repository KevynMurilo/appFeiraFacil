import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopoNavegacao from '../../components/TopoNavegacao';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function VerFaltasScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feiranteId } = route.params;

  const [faltas, setFaltas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFaltas = async () => {
    try {
      setCarregando(true);
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(`${API_URL}/faltas/feirante/${feiranteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = response.data;

      if (json.success) {
        setFaltas(json.data);
      } else {
        Alert.alert('Erro', json.message || 'Não foi possível carregar as faltas.');
      }
    } catch (error) {
      console.error('Erro ao buscar faltas:', error);
      Alert.alert('Erro', 'Erro ao comunicar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarFaltas();
    }, [])
  );

  const getStatusCor = (status) => {
    switch (status) {
      case 'PENDENTE': return '#f90';
      case 'ACEITA': return 'green';
      case 'RECUSADA': return 'red';
      default: return '#555';
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Minhas Faltas" />

      {carregando ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {faltas.length === 0 ? (
            <Text style={styles.semFaltas}>Nenhuma falta registrada.</Text>
          ) : (
            faltas.map((falta, index) => {
              const podeJustificar = !falta.statusJustificativa;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => {
                    if (podeJustificar) {
                      navigation.navigate('JustificarFalta', {
                        feiranteId,
                        faltaId: falta.idFalta,
                      });
                    }
                  }}
                  activeOpacity={podeJustificar ? 0.7 : 1}
                >
                  <Text style={styles.dataFalta}>
                    📅 {new Date(falta.dataFalta).toLocaleDateString()}
                  </Text>

                  <View style={styles.linha}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={20}
                      color={getStatusCor(falta.statusJustificativa)}
                    />
                    <Text style={[styles.status, { color: getStatusCor(falta.statusJustificativa) }]}>
                      {falta.statusJustificativa || 'Sem justificativa'}
                    </Text>
                  </View>

                  {falta.motivoJustificativa && (
                    <Text style={styles.motivo}>📝 {falta.motivoJustificativa}</Text>
                  )}

                  {podeJustificar && !falta.motivoJustificativa && (
                    <Text style={styles.justificarDica}>Toque para justificar</Text>
                  )}
                </TouchableOpacity>
              );
            })
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#F2F6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#004AAD',
  },
  dataFalta: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#004AAD',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  status: {
    fontSize: 15,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  motivo: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
  semFaltas: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  justificarDica: {
    marginTop: 10,
    color: '#004AAD',
    fontSize: 13,
    fontStyle: 'italic',
  },
});

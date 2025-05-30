import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function FeirasRegistradasScreen() {
  const navigation = useNavigation();
  const [feiras, setFeiras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const carregarFeiras = async () => {
        setCarregando(true);
        try {
          const usuarioId = await AsyncStorage.getItem('usuarioId');
          if (!usuarioId) return;

          const response = await axios.get(
            `http://10.1.59.59:8080/api/feiras/com-banca/${usuarioId}`
          );

          const res = response.data;

          if (res.success && res.data) {
            setFeiras(res.data);
          } else {
            setFeiras([]);
          }
        } catch (err) {
          console.error('Erro ao buscar feiras registradas:', err);
          Alert.alert('Erro', 'Não foi possível carregar as feiras.');
        } finally {
          setCarregando(false);
        }
      };

      carregarFeiras();
    }, [])
  );

  const renderFeira = (feira) => (
    <View key={feira.id} style={styles.card}>
      <Text style={styles.nomeFeira}>{feira.nome}</Text>
      <Text style={styles.status}>
        Status:{' '}
        <Text style={{ fontWeight: 'bold', color: feira.statusFila === 'ATIVO' ? 'green' : '#f90' }}>
          {feira.statusFila}
        </Text>
      </Text>
      {feira.statusFila !== 'ATIVO' && feira.posicaoFila && (
        <Text style={styles.fila}>Fila de espera: {feira.posicaoFila}</Text>
      )}

      <TouchableOpacity
        style={styles.botaoInterno}
        onPress={async () => {
          try {
            const feiranteId = await AsyncStorage.getItem('usuarioId');
            const response = await axios.get(
              `http://10.1.59.59:8080/api/bancas/feirante/${feiranteId}/feira/${feira.id}`
            );
            const res = response.data;

            if (res.success && res.data) {
              navigation.navigate('VerMinhaBanca', {
                banca: {
                  ...res.data,
                  feira: { nome: feira.nome },
                },
              });
            } else {
              Alert.alert('Aviso', 'Banca não encontrada nesta feira.');
            }
          } catch (error) {
            console.error('Erro ao buscar banca:', error);
            Alert.alert('Erro', 'Erro ao buscar banca.');
          }
        }}
      >
        <Text style={styles.botaoInternoTexto}>Ver Minha Banca</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {carregando ? (
          <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 50 }} />
        ) : feiras.length > 0 ? (
          feiras.map(renderFeira)
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#555' }}>
            Nenhuma feira registrada encontrada.
          </Text>
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
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  nomeFeira: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 4,
  },
  status: {
    fontSize: 15,
    marginBottom: 4,
  },
  fila: {
    fontSize: 14,
    marginBottom: 8,
    color: '#f90',
  },
  botaoInterno: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  botaoInternoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

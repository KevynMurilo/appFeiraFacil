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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GerenciarFeirantesScreen() {
  const navigation = useNavigation();
  const [feirantes, setFeirantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregarFeirantes = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get('http://192.168.18.17:8080/api/feirantes', {
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
        }
      };

      setLoading(true); // mostra loading sempre que reentra
      carregarFeirantes();
    }, [])
  );

  const renderFeirante = (feirante) => (
    <View key={feirante.id} style={styles.card}>
      <Text style={styles.nome}>{feirante.nome}</Text>
      <Text style={styles.email}>{feirante.email}</Text>

      <TouchableOpacity
        style={styles.botaoInterno}
        onPress={() => navigation.navigate('VerDetalhesFeirante', { feirante })}
      >
        <Text style={styles.botaoInternoTexto}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {feirantes.length > 0 ? (
            feirantes.map(renderFeirante)
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 30 }}>Nenhum feirante encontrado.</Text>
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
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  botaoInterno: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
  },
  botaoInternoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function JustificarFaltaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feiranteId, faltaId } = route.params;

  const [motivo, setMotivo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const justificarFalta = async () => {
    if (!motivo.trim()) {
      Alert.alert('Atenção', 'Por favor, escreva o motivo da sua ausência.');
      return;
    }

    try {
      setCarregando(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/justificativas`,
        {
          faltaId,
          motivo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const res = response.data;

      if (res.success) {
        Alert.alert('Sucesso', 'Justificativa enviada com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', res.message || 'Não foi possível registrar a justificativa.');
      }
    } catch (err) {
      console.error('Erro ao enviar justificativa:', err);
      Alert.alert('Erro', 'Erro ao comunicar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Justificar Falta" />

      <View style={styles.container}>
        <Text style={styles.label}>Explique o motivo da ausência:</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={6}
          placeholder="Digite aqui sua justificativa..."
          value={motivo}
          onChangeText={setMotivo}
        />

        <TouchableOpacity
          style={styles.botaoEnviar}
          onPress={justificarFalta}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>Enviar Justificativa</Text>
          )}
        </TouchableOpacity>
      </View>
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
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#004AAD',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 140,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: '#F9F9F9',
    fontSize: 15,
    marginBottom: 20,
  },
  botaoEnviar: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

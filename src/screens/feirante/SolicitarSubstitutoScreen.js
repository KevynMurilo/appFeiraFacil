import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SolicitarSubstitutoScreen() {
  const [cpf, setCpf] = useState('');
  const [feirante, setFeirante] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const buscarFeirante = async () => {
    if (!cpf) {
      Alert.alert('Atenção', 'Digite um CPF');
      return;
    }

    setBuscando(true);
    setFeirante(null);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `http://192.168.18.17:8080/api/feirantes/buscar?cpf=${cpf}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = response.data;

      if (res.success && res.data) {
        setFeirante(res.data);
      } else {
        Alert.alert('Aviso', res.message || 'Feirante não encontrado');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao buscar feirante.');
    } finally {
      setBuscando(false);
    }
  };

  const enviarSolicitacao = async () => {
    if (!feirante) return;

    try {
      setEnviando(true);
      const idTitular = await AsyncStorage.getItem('usuarioId');
      const token = await AsyncStorage.getItem('token');
      const idSubstituto = feirante.id;

      if (!idTitular || !idSubstituto || !token) {
        Alert.alert('Erro', 'ID ou token ausente. Faça login novamente.');
        return;
      }

      const url = `http://192.168.18.17:8080/api/solicitacar-substitutos/enviar?idTitular=${idTitular}&idSubstituto=${idSubstituto}`;

      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = response.data;
      console.log("Resposta da solicitação:", res); // 🐞 debug

      if (res?.success === true) {
        Alert.alert('Sucesso', res?.message || 'Solicitação enviada.');
        setFeirante(null);
        setCpf('');
      } else {
        Alert.alert('Erro', res?.message || 'Falha ao enviar solicitação.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao enviar solicitação.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Digite o CPF do substituto"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.botao} onPress={buscarFeirante}>
          <Text style={styles.botaoTexto}>🔍 Buscar Feirante</Text>
        </TouchableOpacity>

        {buscando && <ActivityIndicator style={{ marginTop: 20 }} />}

        {feirante && (
          <View style={styles.card}>
            <Text style={styles.nome}>Nome: {feirante.nome}</Text>
            <Text style={styles.email}>Email: {feirante.email}</Text>

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: '#4CAF50', marginTop: 10 }]}
              onPress={enviarSolicitacao}
              disabled={enviando}
            >
              <Text style={styles.botaoTexto}>
                {enviando ? 'Enviando...' : '📨 Enviar Solicitação'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    marginTop: 20,
    padding: 18,
    backgroundColor: '#F2F6FF',
    borderRadius: 12,
  },
  nome: {
    fontSize: 16,
    marginBottom: 6,
  },
  email: {
    fontSize: 15,
    color: '#555',
  },
});

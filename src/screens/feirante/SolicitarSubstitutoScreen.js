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
  Platform,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function SolicitarSubstitutoScreen() {
  const [cpf, setCpf] = useState('');
  const [feirante, setFeirante] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());

  const [mostraInicio, setMostraInicio] = useState(false);
  const [mostraFim, setMostraFim] = useState(false);

  const buscarFeirante = async () => {
    if (!cpf) {
      Alert.alert('Atenção', 'Digite um CPF');
      return;
    }

    Keyboard.dismiss();

    setBuscando(true);
    setFeirante(null);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/feirantes/buscar?cpf=${cpf}`,
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

      if (!idTitular || !feirante.id || !token) {
        Alert.alert('Erro', 'ID ou token ausente. Faça login novamente.');
        return;
      }

      const payload = {
        idTitular,
        idSubstituto: feirante.id,
        dataInicio,
        dataFim,
      };

      const response = await axios.post(
        `${API_URL}/solicitacar-substitutos/enviar`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = response.data;

      if (res?.success) {
        Alert.alert('Sucesso', res.message || 'Solicitação enviada.');
        setFeirante(null);
        setCpf('');
      } else {
        Alert.alert('Erro', res.message || 'Falha ao enviar solicitação.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao enviar solicitação.');
    } finally {
      setEnviando(false);
    }
  };

  const formatarData = (data) =>
    data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  const toggleInicio = () => {
    setMostraFim(false);
    setMostraInicio(!mostraInicio);
  };

  const toggleFim = () => {
    setMostraInicio(false);
    setMostraFim(!mostraFim);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Solicitar Substituto" />

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

            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>📅 Escolha a Data de Início</Text>
              <TouchableOpacity style={styles.dataPickerBotao} onPress={toggleInicio}>
                <Text style={styles.dataPickerTexto}>{formatarData(dataInicio)}</Text>
              </TouchableOpacity>
              {mostraInicio && (
                <DateTimePicker
                  value={dataInicio}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setMostraInicio(false);
                    if (date) setDataInicio(date);
                  }}
                />
              )}
            </View>

            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>📅 Escolha a Data de Fim</Text>
              <TouchableOpacity style={styles.dataPickerBotao} onPress={toggleFim}>
                <Text style={styles.dataPickerTexto}>{formatarData(dataFim)}</Text>
              </TouchableOpacity>
              {mostraFim && (
                <DateTimePicker
                  value={dataFim}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setMostraFim(false);
                    if (date) setDataFim(date);
                  }}
                />
              )}
            </View>

            <TouchableOpacity
              style={[styles.botao, { backgroundColor: '#4CAF50', marginTop: 20 }]}
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
    backgroundColor: '#00AEEF',
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
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 4,
    fontSize: 15,
  },
  dataPickerBotao: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#004AAD',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dataPickerTexto: {
    fontSize: 16,
    color: '#004AAD',
  },
});

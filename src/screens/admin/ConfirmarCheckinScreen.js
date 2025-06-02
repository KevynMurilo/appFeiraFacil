import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopoNavegacao from '../../components/TopoNavegacao';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ConfirmarCheckinScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { qrCode } = route.params;

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`http://10.1.59.59:8080/api/bancas/por-qr/${qrCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setDados(res.data.data);
        } else {
          Alert.alert('Erro', res.data.message);
          navigation.goBack();
        }
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível buscar os dados da banca');
        console.error(err);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [qrCode]);

  const handleConfirmar = async () => {
    if (!dados?.banca || !dados?.feirante) return;

    try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(
        `http://10.1.59.59:8080/api/checkins`,
        null,
        {
            params: {
            idBanca: dados.banca.id,
            idFeirante: dados.feirante.id,
            },
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        const resultado = response.data;

        if (resultado.success) {
        Alert.alert('✅ Sucesso', resultado.message || 'Check-in confirmado com sucesso');
        navigation.goBack();
        } else {
        Alert.alert('❌ Erro', resultado.message || 'Não foi possível registrar o check-in.');
        }

    } catch (error) {
        // 🌐 Log de erro HTTP (ex: timeout, rede, status inválido)
        console.error('❗ Erro no check-in:', error);

        const mensagemErro = error.response?.data?.message || 'Erro inesperado ao registrar o check-in.';
        Alert.alert('Erro', mensagemErro);
    }
    };


  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Confirmar Check-in" />
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  const { banca, feirante } = dados;

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Confirmar Check-in" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>📋 Dados do Feirante</Text>
        <Info label="Nome" valor={feirante.nome} />
        <Info label="CPF" valor={feirante.cpf} />
        <Info label="Telefone" valor={feirante.telefone} />
        <Info label="E-mail" valor={feirante.email} />

        <Text style={styles.titulo}>🛒 Dados da Banca</Text>
        <Info label="Feira" valor={banca.nomeFeira} />
        <Info label="Tipo de Produto" valor={banca.tipoProduto} />
        <Info label="Produtos" valor={banca.produtos.join(', ')} />

        <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.botaoTexto}>Confirmar Presença</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Info = ({ label, valor }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.valor}>{valor}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#004AAD',
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
    fontSize: 15,
  },
  valor: {
    fontSize: 16,
    color: '#333',
  },
  botaoConfirmar: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

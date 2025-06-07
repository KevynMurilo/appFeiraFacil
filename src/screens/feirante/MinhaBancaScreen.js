import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerBancaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bancaId } = route.params;

  const [banca, setBanca] = useState(null);
  const [feirante, setFeirante] = useState(null);
  const [feira, setFeira] = useState(null);
  const [posicoesFila, setPosicoesFila] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarBanca();
  }, []);

  useEffect(() => {
    if (feira && feirante && banca?.horarios) {
      buscarPosicoesFeirante();
    }
  }, [feira, feirante, banca]);

  const buscarBanca = async () => {
    setCarregando(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/bancas/${bancaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = response.data;

      if (res.success && res.data) {
        setBanca(res.data.banca);
        setFeirante(res.data.feirante);
        setFeira(res.data.feira);
      } else {
        Alert.alert('Erro', res.message || 'Erro ao buscar banca.');
      }
    } catch (error) {
      console.error('Erro ao buscar banca:', error);
      Alert.alert('Erro', 'Falha ao buscar dados da banca.');
    } finally {
      setCarregando(false);
    }
  };

  const buscarPosicoesFeirante = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/fila-espera/posicoes-feirante`, {
        params: { idFeirante: feirante.id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success && res.data.data) {
        setPosicoesFila(res.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar posições da fila do feirante:', error);
    }
  };

  const confirmarRemocao = () => {
    Alert.alert(
      'Remover Banca',
      'Tem certeza que deseja remover esta banca? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: deletarBanca },
      ]
    );
  };

  const deletarBanca = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/bancas/${bancaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        Alert.alert('Sucesso', 'Banca removida com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao remover banca.');
      }
    } catch (error) {
      console.error('Erro ao deletar banca:', error);
      Alert.alert('Erro', 'Falha na comunicação com o servidor.');
    }
  };

  if (carregando || !banca || !feirante || !feira) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Detalhes da Banca" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#004AAD" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Detalhes da Banca" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>🫜 Tipo de Produto</Text>
          <View style={styles.secaoConteudo}>
            <Text style={styles.valor}>{banca.tipoProduto}</Text>
          </View>

          <Text style={styles.secaoTitulo}>📦 Produtos</Text>
          <View style={styles.secaoConteudo}>
            {banca.produtos?.length > 0 ? (
              banca.produtos.map((produto, index) => (
                <Text key={index} style={styles.valorLista}>• {produto}</Text>
              ))
            ) : (
              <Text style={styles.valor}>Nenhum produto informado</Text>
            )}
          </View>

          <Text style={styles.secaoTitulo}>🕒 Horários</Text>
          {banca.horarios.map((h, idx) => {
            const posicao = posicoesFila[h.id];
            const estaNaFila = posicao?.estaNaFila === true;
            const qrCodeHorario = h.qrCode;

            return (
              <View
                key={idx}
                style={[
                  styles.secaoConteudo,
                  {
                    marginBottom: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.valorLista}>• {h.dia}: {h.horarioInicio} - {h.horarioFim}</Text>
                  {estaNaFila && (
                    <Text style={{ color: '#c60', fontWeight: 'bold', marginTop: 6 }}>
                      Você está na posição {posicao.posicao} de {posicao.totalNaFila} na fila deste horário.
                    </Text>
                  )}
                </View>

                {!estaNaFila && qrCodeHorario && (
                  <TouchableOpacity onPress={() => navigation.navigate('VerQrCode', { qrCode: qrCodeHorario })}>
                    <Ionicons name="qr-code-outline" size={24} color="#004AAD" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Text style={styles.secaoTitulo}>📍 Feira</Text>
          <View style={styles.secaoConteudo}>
            <Text style={styles.valor}>{feira.nome}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoQr} onPress={() => navigation.navigate('EditarBanca', { bancaId })}>
          <Ionicons name="create-outline" size={20} color="#004AAD" />
          <Text style={styles.botaoQrTexto}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarRemocao}>
          <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
          <Text style={styles.botaoExcluirTexto}>Excluir Banca</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  secaoTitulo: {
    fontSize: 16,
    color: '#004AAD',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 14,
  },
  secaoConteudo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  valor: { fontSize: 15.5, color: '#333', lineHeight: 22 },
  valorLista: { fontSize: 15.5, color: '#333', lineHeight: 24 },
  botaoQr: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F0FF',
    borderWidth: 1,
    borderColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  botaoQrTexto: {
    marginLeft: 8,
    color: '#004AAD',
    fontWeight: 'bold',
    fontSize: 15,
  },
  botaoExcluir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE6E6',
    borderWidth: 1,
    borderColor: '#FF4D4D',
    paddingVertical: 14,
    borderRadius: 12,
  },
  botaoExcluirTexto: {
    marginLeft: 8,
    color: '#FF4D4D',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

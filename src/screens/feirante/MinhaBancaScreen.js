import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function VerBancaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { banca, feira, feirante } = route.params;

  const [posicaoFila, setPosicaoFila] = useState(null);
  const [totalFila, setTotalFila] = useState(null);
  const [nomeFeiraFila, setNomeFeiraFila] = useState('');
  const statusFeirante = feirante?.status;

  useEffect(() => {
    if (statusFeirante === 'NA_FILA_DE_ESPERA') {
      buscarPosicaoNaFila();
    }
  }, []);

  const buscarPosicaoNaFila = async () => {
    try {
      const res = await axios.get(
        `http://10.1.59.59:8080/api/fila-espera/minha-posicao`,
        {
          params: {
            idFeira: feira.id,
            idFeirante: feirante.id,
          },
        }
      );

      console.log(res.data);

      if (res.data?.success && res.data.data?.posicao != null) {
        setPosicaoFila(res.data.data.posicao);
        setTotalFila(res.data.data.totalNaFila);
        setNomeFeiraFila(res.data.data.feira);
      }
    } catch (error) {
      console.error('Erro ao buscar posição na fila:', error);
    }
  };

  const confirmarRemocao = () => {
    Alert.alert(
      'Remover Banca',
      'Tem certeza que deseja remover esta banca? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: deletarBanca,
        },
      ]
    );
  };

  const deletarBanca = async () => {
    try {
      const response = await axios.delete(`http://10.1.59.59:8080/api/bancas/${banca.id}`);
      const res = response.data;

      if (res.success) {
        Alert.alert('Sucesso', 'Banca removida com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', res.message || 'Erro ao remover banca.');
      }
    } catch (error) {
      console.error('Erro ao deletar banca:', error);
      Alert.alert('Erro', 'Falha na comunicação com o servidor.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Detalhes da Banca" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>🧺 Tipo de Produto</Text>
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

          <Text style={styles.secaoTitulo}>📍 Feira Vinculada</Text>
          <View style={styles.secaoConteudo}>
            <Text style={styles.valor}>{feira?.nome || 'Não informada'}</Text>
          </View>

          <Text style={styles.secaoTitulo}>📋 Status do Feirante</Text>
          <View style={styles.secaoConteudo}>
            <Text style={[styles.valor, { fontWeight: 'bold', color: statusFeirante === 'ATIVO' ? 'green' : '#c90' }]}>
              {statusFeirante}
            </Text>
          </View>

          {posicaoFila !== null && (
            <View style={[styles.secaoConteudo, { backgroundColor: '#FFF8E6', borderColor: '#f90' }]}>
              <Text style={[styles.valor, { color: '#c60', fontWeight: 'bold' }]}>
                Você está na posição {posicaoFila} de {totalFila} na fila da feira "{nomeFeiraFila}".
              </Text>
            </View>
          )}
        </View>

        {statusFeirante === 'ATIVO' && (
          <TouchableOpacity
            style={styles.botaoQr}
            onPress={() => navigation.navigate('VerQrCode', { qrCode: banca.qrCode })}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#004AAD" />
            <Text style={styles.botaoQrTexto}>Ver QR Code da Banca</Text>
          </TouchableOpacity>
        )}

        {(statusFeirante === 'AGUARDANDO_REVISÃO' ||
          statusFeirante === 'INATIVO' ||
          statusFeirante === 'SUBSTITUIDO_POR_FALTAS') && (
          <TouchableOpacity
            style={styles.botaoJustificar}
            onPress={() => navigation.navigate('VerFaltas', { feiranteId: feirante.id })}
          >
            <Ionicons name="document-text-outline" size={20} color="#f90" />
            <Text style={styles.botaoJustificarTexto}>Ver Faltas</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarRemocao}>
          <Ionicons name="trash-outline" size={20} color="#FF4D4D" />
          <Text style={styles.botaoExcluirTexto}>Excluir Banca</Text>
        </TouchableOpacity>
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
    backgroundColor: '#fff',
    flexGrow: 1,
  },
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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  valor: {
    fontSize: 15.5,
    color: '#333',
    lineHeight: 22,
  },
  valorLista: {
    fontSize: 15.5,
    color: '#333',
    lineHeight: 24,
    marginLeft: 4,
  },
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
  botaoJustificar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E6',
    borderWidth: 1,
    borderColor: '#f90',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  botaoJustificarTexto: {
    marginLeft: 8,
    color: '#f90',
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

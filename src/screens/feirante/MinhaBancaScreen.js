import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function VerBancaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { banca } = route.params;

  const confirmarRemocao = () => {
    Alert.alert(
      'Remover Banca',
      'Tem certeza que deseja remover esta banca? Essa ação não pode ser desfeita.',
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
      const response = await axios.delete(`http://192.168.18.17:8080/api/bancas/${banca.id}`);
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

      <TouchableOpacity style={styles.iconeLixeira} onPress={confirmarRemocao}>
        <Ionicons name="trash-outline" size={26} color="#FF4D4D" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.secaoTitulo}>🧺 Tipo de Produto</Text>
          <View style={styles.secaoConteudo}>
            <Text style={styles.valor}>{banca.tipoProduto}</Text>
          </View>

          <Text style={styles.secaoTitulo}>📦 Produtos</Text>
          <View style={styles.secaoConteudo}>
            {banca.produtos.length > 0 ? (
              banca.produtos.map((produto, index) => (
                <Text key={index} style={styles.valorLista}>• {produto}</Text>
              ))
            ) : (
              <Text style={styles.valor}>Nenhum produto informado</Text>
            )}
          </View>

          <Text style={styles.secaoTitulo}>📍 Feira Vinculada</Text>
          <View style={styles.secaoConteudo}>
            <Text style={styles.valor}>
              {banca.feira?.nome || 'Não informada'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('VerQrCode', { qrCode: banca.qrCode })}
        >
          <Text style={styles.botaoTexto}>📤 Ver QR Code da Banca</Text>
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
  iconeLixeira: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 8,
    padding: 4,
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
    shadowOpacity: 0.05,
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
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 50,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

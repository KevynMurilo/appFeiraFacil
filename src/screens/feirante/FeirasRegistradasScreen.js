import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FeirasRegistradasScreen() {
  const navigation = useNavigation();

  const feiras = [
    { id: 1, nome: 'Feira do Centro', status: 'ATIVO', posicaoFila: null },
    { id: 2, nome: 'Feira do Bairro Novo', status: 'EM_FILA', posicaoFila: 3 },
  ];

  const renderFeira = (feira) => (
    <View key={feira.id} style={styles.card}>
      <Text style={styles.nomeFeira}>{feira.nome}</Text>
      <Text style={styles.status}>
        Status:{' '}
        <Text style={{ fontWeight: 'bold', color: feira.status === 'ATIVO' ? 'green' : '#f90' }}>
          {feira.status}
        </Text>
      </Text>
      {feira.status === 'EM_FILA' && (
        <Text style={styles.fila}>Fila de espera: {feira.posicaoFila}</Text>
      )}

      <TouchableOpacity
        style={styles.botaoInterno}
        onPress={() =>
          navigation.navigate('VerMinhaBanca', {
            banca: {
              tipoProduto: 'Verduras e Legumes',
              produtos: ['Alface', 'Cenoura', 'Couve'],
              feira: { nome: feira.nome },
              qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=Banca-' + feira.id,
            },
          })
        }
      >
        <Text style={styles.botaoInternoTexto}>Ver Minha Banca</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {feiras.map(renderFeira)}
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

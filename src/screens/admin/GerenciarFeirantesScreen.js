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
import TopoNavegacao from '../../components/TopoNavegacao';

export default function GerenciarFeirantesScreen() {
  const navigation = useNavigation();

  const feirantes = [
    {
      id: '1',
      nome: 'João da Feira',
      email: 'joao@email.com',
      telefone: '61999999999',
      feiras: [{ nome: 'Feira do Centro' }, { nome: 'Feira do Norte' }],
      banca: {
        tipoProduto: 'Verduras e Legumes',
        produtos: ['Alface', 'Cenoura', 'Couve'],
      },
    },
    {
      id: '2',
      nome: 'Maria Verdureira',
      email: 'maria@email.com',
      telefone: '61988888888',
      feiras: [{ nome: 'Feira do Sul' }],
      banca: {
        tipoProduto: 'Frutas',
        produtos: ['Banana', 'Maçã', 'Uva'],
      },
    },
  ];

  const renderFeirante = (feirante) => (
    <View key={feirante.id} style={styles.card}>
      <Text style={styles.nome}>{feirante.nome}</Text>
      <Text style={styles.email}>{feirante.email}</Text>

      <TouchableOpacity
        style={styles.botaoInterno}
        onPress={() =>
          navigation.navigate('VerDetalhesFeirante', { feirante })
        }
      >
        <Text style={styles.botaoInternoTexto}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao
        titulo="Gerenciar Feirantes"
        subtitulo="Lista de feirantes cadastrados"
      />

      <ScrollView contentContainerStyle={styles.container}>
        {feirantes.map(renderFeirante)}
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

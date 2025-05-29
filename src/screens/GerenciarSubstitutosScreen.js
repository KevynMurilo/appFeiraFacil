import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function GerenciarSubstitutosScreen() {
  const navigation = useNavigation();

  const [substitutos, setSubstitutos] = useState([
    { id: '1', nome: 'Carlos Silva', telefone: '61999990000', email: 'carlos@email.com' },
    { id: '2', nome: 'Ana Souza', telefone: '61988881111', email: 'ana@email.com' },
    { id: '3', nome: 'João Mendes', telefone: '61987776666', email: 'joao@email.com' },
    { id: '4', nome: 'Mariana Lima', telefone: '61976665544', email: 'mariana@email.com' },
    { id: '5', nome: 'Pedro Rocha', telefone: '61999991111', email: 'pedro@email.com' },
    { id: '6', nome: 'Letícia Gomes', telefone: '61988882222', email: 'leticia@email.com' },
    { id: '7', nome: 'Rafael Dias', telefone: '61977773333', email: 'rafael@email.com' },
    { id: '8', nome: 'Fernanda Costa', telefone: '61966664444', email: 'fernanda@email.com' },
    { id: '9', nome: 'Lucas Martins', telefone: '61955556666', email: 'lucas@email.com' },
    { id: '10', nome: 'Juliana Alves', telefone: '61944447777', email: 'juliana@email.com' },
    ]);

  const removerSubstituto = (id) => {
    Alert.alert(
      'Confirmar Remoção',
      'Tem certeza que deseja remover este substituto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          onPress: () =>
            setSubstitutos((prev) => prev.filter((sub) => sub.id !== id)),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoAdicionarTopo}
          onPress={() => navigation.navigate('CadastrarSubstituto')}
        >
          <Text style={styles.botaoAdicionarTopoTexto}>＋ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Gerenciar Substitutos</Text>

      {substitutos.map((sub) => (
        <View key={sub.id} style={styles.card}>
          <Text style={styles.nome}>{sub.nome}</Text>
          <Text style={styles.dado}>📞 {sub.telefone}</Text>
          <Text style={styles.dado}>✉️ {sub.email}</Text>
          <TouchableOpacity style={styles.botaoRemover} onPress={() => removerSubstituto(sub.id)}>
            <Text style={styles.botaoRemoverTexto}>Remover</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  voltarTexto: {
    color: '#004AAD',
    fontSize: 16,
  },
  botaoAdicionarTopo: {
    backgroundColor: '#004AAD',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  botaoAdicionarTopoTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  dado: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  botaoRemover: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoRemoverTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

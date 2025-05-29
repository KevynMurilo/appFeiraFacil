import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function GerenciarSubstitutosScreen() {
  const navigation = useNavigation();

  const [substitutos, setSubstitutos] = useState([
    { id: '1', nome: 'Carlos Silva', telefone: '61999990000', email: 'carlos@email.com' },
    { id: '2', nome: 'Ana Souza', telefone: '61988881111', email: 'ana@email.com' },
    { id: '3', nome: 'João Mendes', telefone: '61987776666', email: 'joao@email.com' },
    { id: '4', nome: 'Mariana Lima', telefone: '61976665544', email: 'mariana@email.com' },
    { id: '5', nome: 'Pedro Rocha', telefone: '61999991111', email: 'pedro@email.com' },
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
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Gerenciar Substitutos" />

      <View style={styles.acoesContainer}>
        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => navigation.navigate('CadastrarSubstituto')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#00AEEF" />
          <Text style={styles.botaoNovoTexto}>Novo Substituto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {substitutos.map((sub) => (
          <View key={sub.id} style={styles.card}>
            <Text style={styles.nome}>{sub.nome}</Text>
            <Text style={styles.dado}>📞 {sub.telefone}</Text>
            <Text style={styles.dado}>✉️ {sub.email}</Text>
            <TouchableOpacity
              style={styles.botaoRemover}
              onPress={() => removerSubstituto(sub.id)}
            >
              <Text style={styles.botaoRemoverTexto}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  acoesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  botaoNovo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  botaoNovoTexto: {
    marginLeft: 6,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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

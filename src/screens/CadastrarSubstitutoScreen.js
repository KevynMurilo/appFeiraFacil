import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CadastrarSubstitutoScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  const handleSalvar = () => {
    if (!nome || !telefone || !email) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const novo = {
      nome,
      telefone,
      email,
    };

    console.log('Novo substituto:', novo);
    Alert.alert('Sucesso', 'Substituto cadastrado!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.titulo}>Cadastrar Substituto</Text>

      {/* Formulário */}
      <Text style={styles.label}>Nome completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.botaoTexto}>Salvar Substituto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  voltar: {
    marginBottom: 15,
  },
  voltarTexto: {
    color: '#004AAD',
    fontSize: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

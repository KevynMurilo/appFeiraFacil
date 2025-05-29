import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

export default function CadastroScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const registrarFeirante = async () => {
    const { nome, cpf, telefone, email, senha } = form;

    if (!nome || !cpf || !telefone || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/feirantes', form);
      Alert.alert('Sucesso', 'Feirante cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao cadastrar. Verifique os dados.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          Vamos <Text style={styles.highlight}>Cadastrar</Text>
        </Text>
        <Text style={styles.subtitle}>Preencha os dados para criar sua conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={form.nome}
          onChangeText={(v) => handleChange('nome', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={form.cpf}
          onChangeText={(v) => handleChange('cpf', v)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={form.telefone}
          onChangeText={(v) => handleChange('telefone', v)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(v) => handleChange('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={form.senha}
          onChangeText={(v) => handleChange('senha', v)}
          secureTextEntry
        />

        <TouchableOpacity style={styles.registerButton} onPress={registrarFeirante}>
          <Text style={styles.registerButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Já tem uma conta?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Entrar
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  highlight: {
    color: '#00AEEF',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#555',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#555',
  },
  link: {
    color: '#00AEEF',
    fontWeight: 'bold',
  },
});

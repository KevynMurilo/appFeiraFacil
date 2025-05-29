import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = async () => {
  if (!email || !senha) {
    Alert.alert('Erro', 'Preencha todos os campos.');
    return;
  }

  // Login local (sem backend)
  if (email === 'admin' && senha === '123') {
    Alert.alert('Login Local', 'Logado como administrador');
    navigation.replace('HomeAdmin');
    return;
  }

  if (email === 'feirante' && senha === '123') {
    Alert.alert('Login Local', 'Logado como feirante');
    navigation.replace('HomeFeirante');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/login', {
      email,
      senha,
    });

    const { token, tipoUsuario, id } = response.data;

    if (tipoUsuario === 'FEIRANTE') {
      Alert.alert('Sucesso', 'Bem-vindo Feirante!');
      navigation.replace('HomeFeirante');
    } else if (tipoUsuario === 'ADMIN') {
      Alert.alert('Sucesso', 'Bem-vindo Administrador!');
      navigation.replace('HomeAdmin');
    } else {
      Alert.alert('Aviso', `Tipo de usuário não reconhecido: ${tipoUsuario}`);
    }

    } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Falha ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Vamos <Text style={styles.highlight}>Entrar</Text></Text>
      <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={fazerLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Não tem uma conta?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
          Cadastre-se
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
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
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 20,
    color: '#00AEEF',
  },
  loginButton: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
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

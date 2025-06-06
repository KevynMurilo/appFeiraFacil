import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null); 

  const exibirMensagem = (mensagem, tipo) => {
    setStatusMessage(mensagem);
    setStatusType(tipo);
    setTimeout(() => {
      setStatusMessage(null);
      setStatusType(null);
    }, 4000);
  };

  const fazerLogin = async () => {
    if (!email || !senha) {
      exibirMensagem('Preencha todos os campos.', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        senhaHash: senha,
      });

      const res = response.data;

      if (!res.success) {
        exibirMensagem(res.message, 'error');
        return;
      }

      const { token, tipoUsuario, usuario } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('tipoUsuario', tipoUsuario);
      await AsyncStorage.setItem('usuarioId', usuario.id);
      await AsyncStorage.setItem('usuarioNome', usuario.nome);
      await AsyncStorage.setItem('usuarioEmail', res.data.email);
      await AsyncStorage.setItem('dataHoraLogin', new Date().toISOString());
      
      exibirMensagem('Login realizado com sucesso!', 'success');

      if (tipoUsuario === 'FEIRANTE') {
        setTimeout(() => {
          navigation.replace('FeiranteDrawer', {
            screen: 'Feiras Registradas',
          });
        }, 1000);
      } else if (tipoUsuario === 'ADMIN') {
        setTimeout(() => {
          navigation.replace('AdminDrawer');
        }, 1000);
      } else {
        exibirMensagem(`Tipo de usuário não reconhecido: ${tipoUsuario}`, 'error');
      }
    } catch (error) {
      console.error(error);
      exibirMensagem('Falha ao fazer login. Verifique suas credenciais.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Vamos <Text style={styles.highlight}>Entrar</Text></Text>
      <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

      {statusMessage && (
        <View style={[styles.messageBox, statusType === 'error' ? styles.errorBox : styles.successBox]}>
          <Text style={styles.messageText}>{statusMessage}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
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
  messageBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: '#ffcccc',
  },
  successBox: {
    backgroundColor: '#ccffcc',
  },
  messageText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
});

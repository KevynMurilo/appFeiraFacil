import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function EditarPerfilScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [tipoMensagem, setTipoMensagem] = useState(null);

  const exibirMensagem = (msg, tipo) => {
    setMensagem(msg);
    setTipoMensagem(tipo);
    setTimeout(() => {
      setMensagem(null);
      setTipoMensagem(null);
    }, 4000);
  };

  const carregarDados = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const tipo = await AsyncStorage.getItem('tipoUsuario');
      const endpoint = tipo === 'ADMIN' ? '/admins/me' : '/feirantes/me'
      ;
      const res = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;
      setNome(data.nome);
      setCpf(data.cpf);
      setTelefone(data.telefone);
      setEmail(data.email);
    } catch (err) {
      console.log(err);
      exibirMensagem('Erro ao carregar dados.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  const salvarAlteracoes = async () => {
    if (senha && senha !== confirmarSenha) {
        exibirMensagem('As senhas não coincidem.', 'erro');
        return;
    }

    try {
        const token = await AsyncStorage.getItem('token');
        const tipo = await AsyncStorage.getItem('tipoUsuario');
        const endpoint = tipo === 'ADMIN' ? '/admins/perfil' : '/feirantes/perfil';
        const payload = { nome, cpf, telefone, email, senha };

        const res = await axios.put(`${API_URL}${endpoint}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { success, message } = res.data;
        exibirMensagem(message, success ? 'sucesso' : 'erro');

        if (success) {
            setSenha('');
            setConfirmarSenha('');
            carregarDados();

            await AsyncStorage.setItem('usuarioNome', nome);
            await AsyncStorage.setItem('usuarioEmail', email);
        }
        } catch (err) {
            console.error(err);
            exibirMensagem('Erro ao atualizar perfil.', 'erro');
        }
    };


  useEffect(() => {
    carregarDados();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004AAD" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TopoNavegacao titulo="Editar Perfil" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {mensagem && (
              <View
                style={[
                  styles.alert,
                  tipoMensagem === 'erro' ? styles.alertErro : styles.alertSucesso,
                ]}
              >
                <Text style={styles.alertText}>{mensagem}</Text>
              </View>
            )}

            <Input label="Nome completo" value={nome} onChangeText={setNome} />
            <Input label="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
            <Input label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Input label="Nova senha (opcional)" value={senha} onChangeText={setSenha} secureTextEntry />
            <Input label="Confirmar senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Input({ label, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#fdfdfd',
  },
  button: {
    backgroundColor: '#004AAD',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#004AAD',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alert: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  alertErro: {
    backgroundColor: '#FFCCCC',
  },
  alertSucesso: {
    backgroundColor: '#CCFFDD',
  },
  alertText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

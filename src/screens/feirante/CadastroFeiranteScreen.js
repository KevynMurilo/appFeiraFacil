import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function CadastroFeiranteScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  });

  const [mensagem, setMensagem] = useState(null); 

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const exibirMensagem = (texto, tipo = 'erro') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  const registrarFeirante = async () => {
    const { nome, cpf, telefone, email, senha } = form;

    if (!nome || !cpf || !telefone || !email || !senha) {
      exibirMensagem('Por favor, preencha todos os campos.', 'erro');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/feirantes`, form);
      const res = response.data;

      if (res.success) {
        exibirMensagem('Cadastro realizado com sucesso!', 'sucesso');
        setTimeout(() => navigation.replace('Login'), 2000);
      } else {
        exibirMensagem(res.message || 'Erro ao cadastrar.');
      }
    } catch (error) {
      console.error(error);
      exibirMensagem('Falha ao conectar com o servidor.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          Vamos <Text style={styles.highlight}>Cadastrar</Text>
        </Text>
        <Text style={styles.subtitle}>Preencha os dados para criar sua conta</Text>

        {mensagem && (
          <View
            style={[
              styles.mensagem,
              mensagem.tipo === 'erro' ? styles.erro : styles.sucesso,
            ]}
          >
            <Text style={styles.mensagemTexto}>{mensagem.texto}</Text>
          </View>
        )}

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
    marginBottom: 20,
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
  mensagem: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  mensagemTexto: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  erro: {
    backgroundColor: '#FFD1D1',
    borderColor: '#FF5A5A',
    borderWidth: 1,
  },
  sucesso: {
    backgroundColor: '#D1FAD7',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
});

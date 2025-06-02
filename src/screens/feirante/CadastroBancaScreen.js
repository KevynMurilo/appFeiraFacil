import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CadastrarBancaScreen() {
  const navigation = useNavigation();

  const [tipoProduto, setTipoProduto] = useState('');
  const [produtoAtual, setProdutoAtual] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [feiraSelecionada, setFeiraSelecionada] = useState('');
  const [feirasDisponiveis, setFeirasDisponiveis] = useState([]);
  const [carregandoFeiras, setCarregandoFeiras] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const carregarFeiras = async () => {
    setCarregandoFeiras(true);
    setMensagemErro('');
    try {
      const response = await axios.get('http://192.168.18.17:8080/api/feiras');
      const res = response.data;

      if (res.success && res.data) {
        setFeirasDisponiveis(res.data);
      } else {
        setMensagemErro(res.message || 'Erro ao carregar feiras.');
      }
    } catch (error) {
      console.error('Erro ao carregar feiras:', error);
      setMensagemErro('Erro ao carregar feiras disponíveis.');
    } finally {
      setCarregandoFeiras(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarFeiras();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarFeiras();
  }, []);

  const adicionarProduto = () => {
    if (produtoAtual.trim() !== '') {
      setProdutos([...produtos, produtoAtual.trim()]);
      setProdutoAtual('');
    }
  };

  const removerProduto = (index) => {
    const novaLista = [...produtos];
    novaLista.splice(index, 1);
    setProdutos(novaLista);
  };

  const handleCadastrar = async () => {
    setMensagemErro('');
    setMensagemSucesso('');

    if (!tipoProduto || produtos.length === 0 || !feiraSelecionada) {
      setMensagemErro('Preencha todos os campos e adicione pelo menos um produto.');
      return;
    }

    try {
      const feiranteId = await AsyncStorage.getItem('usuarioId');
      if (!feiranteId) {
        setMensagemErro('Usuário não identificado.');
        return;
      }

      const payload = {
        tipoProduto,
        produtos,
        feiraId: feiraSelecionada,
        feiranteId,
      };

      const response = await axios.post('http://192.168.18.17:8080/api/bancas', payload);
      const res = response.data;

      if (res.success) {
        setMensagemSucesso('Banca cadastrada com sucesso!');
        // 🧹 Limpa os campos após sucesso
        setTipoProduto('');
        setProdutoAtual('');
        setProdutos([]);
        setFeiraSelecionada('');
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        setMensagemErro(res.message || 'Erro ao cadastrar banca.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar banca:', error);
      setMensagemErro('Erro na comunicação com o servidor.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
        }
      >
        {mensagemErro !== '' && <Text style={styles.alertaErro}>❌ {mensagemErro}</Text>}
        {mensagemSucesso !== '' && <Text style={styles.alertaSucesso}>✅ {mensagemSucesso}</Text>}

        <Text style={styles.label}>📍 Selecione a feira</Text>
        {carregandoFeiras ? (
          <ActivityIndicator size="large" color="#004AAD" />
        ) : feirasDisponiveis.length === 0 ? (
          <Text style={styles.semFeiraTexto}>Nenhuma feira disponível no momento.</Text>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={feiraSelecionada}
              onValueChange={(itemValue) => setFeiraSelecionada(itemValue)}
            >
              <Picker.Item label="Selecione uma feira" value="" />
              {feirasDisponiveis.map((feira) => (
                <Picker.Item key={feira.id} label={feira.nome} value={feira.id} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>🧺 Tipo de Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hortaliças"
          value={tipoProduto}
          onChangeText={setTipoProduto}
        />

        <Text style={styles.label}>📦 Adicionar Produto</Text>
        <View style={styles.linhaProduto}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: Alface"
            value={produtoAtual}
            onChangeText={setProdutoAtual}
          />
          <TouchableOpacity onPress={adicionarProduto} style={styles.botaoAdd}>
            <Ionicons name="add-circle" size={30} color="#00AEEF" />
          </TouchableOpacity>
        </View>

        {produtos.length > 0 && (
          <View style={styles.listaProdutos}>
            <Text style={styles.label}>✅ Produtos Adicionados</Text>
            <View style={styles.cardProdutos}>
              {produtos.map((p, idx) => (
                <View key={idx} style={styles.produtoLinha}>
                  <Text style={styles.produtoItem}>• {p}</Text>
                  <TouchableOpacity onPress={() => removerProduto(idx)}>
                    <Ionicons name="close-circle" size={20} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
          <Text style={styles.botaoTexto}>Cadastrar Banca</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  alertaErro: {
    backgroundColor: '#FFEBEB',
    color: '#D8000C',
    borderLeftWidth: 5,
    borderLeftColor: '#D8000C',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  alertaSucesso: {
    backgroundColor: '#E6FFED',
    color: '#2E7D32',
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 12,
    color: '#004AAD',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  semFeiraTexto: {
    fontStyle: 'italic',
    color: '#999',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
  },
  linhaProduto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  botaoAdd: {
    padding: 4,
  },
  listaProdutos: {
    marginTop: 10,
    marginBottom: 20,
  },
  cardProdutos: {
    backgroundColor: '#F2F6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  produtoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  produtoItem: {
    fontSize: 15,
    color: '#333',
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

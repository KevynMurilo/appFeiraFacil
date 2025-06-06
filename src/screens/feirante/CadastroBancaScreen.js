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
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function CadastrarBancaScreen() {
  const navigation = useNavigation();

  const [tipoProduto, setTipoProduto] = useState('');
  const [produtoAtual, setProdutoAtual] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [feiraSelecionada, setFeiraSelecionada] = useState('');
  const [feirasDisponiveis, setFeirasDisponiveis] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [carregandoFeiras, setCarregandoFeiras] = useState(true);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const carregarFeiras = async () => {
    setCarregandoFeiras(true);
    setMensagemErro('');
    try {
      const response = await axios.get(`${API_URL}/feiras`);
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

  const carregarHorarios = async (feiraId) => {
    setCarregandoHorarios(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/horarios/feira/${feiraId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = response.data;
      if (res.success && res.data) {
        setHorariosDisponiveis(res.data);
        setHorariosSelecionados([]);
      } else {
        setHorariosDisponiveis([]);
        setHorariosSelecionados([]);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    } finally {
      setCarregandoHorarios(false);
    }
  };


  useEffect(() => {
    carregarFeiras();
  }, []);

  useEffect(() => {
    if (feiraSelecionada) {
      carregarHorarios(feiraSelecionada);
    }
  }, [feiraSelecionada]);

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

  const toggleHorarioSelecionado = (horarioId) => {
    if (horariosSelecionados.includes(horarioId)) {
      setHorariosSelecionados(horariosSelecionados.filter(h => h !== horarioId));
    } else {
      setHorariosSelecionados([...horariosSelecionados, horarioId]);
    }
  };

  const handleCadastrar = async () => {
    setMensagemErro('');
    setMensagemSucesso('');

    if (!tipoProduto || produtos.length === 0 || !feiraSelecionada) {
      setMensagemErro('Preencha todos os campos obrigatórios.');
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
        feiranteId,
        feiraId: feiraSelecionada,
        horarioIds: horariosSelecionados,
      };

      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(`${API_URL}/bancas`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = response.data;

      if (res.success) {
        setMensagemSucesso('Banca cadastrada com sucesso!');
        setTipoProduto('');
        setProdutoAtual('');
        setProdutos([]);
        setFeiraSelecionada('');
        setHorariosSelecionados([]);
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
      <TopoNavegacao titulo="Cadastrar Banca" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />}
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

        {horariosDisponiveis.length > 0 && (
          <View>
            <Text style={styles.label}>🕒 Selecione os horários</Text>
            {horariosDisponiveis.map((h) => (
              <TouchableOpacity
                key={h.id}
                onPress={() => toggleHorarioSelecionado(h.id)}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
              >
                <Ionicons
                  name={horariosSelecionados.includes(h.id) ? 'checkbox' : 'square-outline'}
                  size={22}
                  color="#004AAD"
                />
                <Text style={{ marginLeft: 8 }}>
                  {h.dia}: {h.horarioInicio} às {h.horarioFim}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>🧺 Tipo de Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hortaliças"
          value={tipoProduto}
          onChangeText={setTipoProduto}
        />

        <Text style={styles.label}>📦 Adicionar Produtos</Text>
        <Text style={styles.instrucao}>
          Escreva o nome de cada produto individualmente e toque em "Adicionar Produto". Você pode adicionar vários produtos à sua banca.
        </Text>

        <View style={styles.linhaProduto}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: Alface"
            value={produtoAtual}
            onChangeText={setProdutoAtual}
          />
          <TouchableOpacity onPress={adicionarProduto} style={styles.botaoAddProduto}>
            <Ionicons name="add-circle-outline" size={24} color="#004AAD" />
            <Text style={styles.textoAddProduto}>Adicionar</Text>
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
  instrucao: {
  fontSize: 13,
  color: '#555',
  marginBottom: 6,
  fontStyle: 'italic',
},
botaoAddProduto: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#E0F0FF',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
},
textoAddProduto: {
  color: '#004AAD',
  fontWeight: '600',
  marginLeft: 6,
},
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function AtualizarBancaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bancaId } = route.params;

  const [tipoProduto, setTipoProduto] = useState('');
  const [produtoAtual, setProdutoAtual] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [feira, setFeira] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    carregarBanca();
  }, []);

  const onRefresh = useCallback(() => {
    if (feira?.id) {
      carregarHorarios(feira.id);
    }
  }, [feira]);

  const carregarBanca = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/bancas/${bancaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.data) {
        const banca = res.data.data.banca;
        setTipoProduto(banca.tipoProduto);
        setProdutos(banca.produtos || []);
        const feiraVinculada = res.data.data.feira;
        setFeira(feiraVinculada);
        const horarioIds = banca.horarios?.map(h => h.id) || [];
        setHorariosSelecionados(horarioIds);
        await carregarHorarios(feiraVinculada.id);
      }
    } catch (err) {
      console.error('Erro ao carregar banca:', err);
      setMensagemErro('Erro ao carregar dados da banca.');
    } finally {
      setCarregando(false);
      setRefreshing(false);
    }
  };

  const carregarHorarios = async (feiraId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/horarios/feira/${feiraId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setHorariosDisponiveis(res.data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
      setMensagemErro('Erro ao buscar horários disponíveis.');
    }
  };

  const adicionarProduto = () => {
    const produto = produtoAtual.trim();
    if (produto !== '' && !produtos.includes(produto)) {
      setProdutos([...produtos, produto]);
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

  const handleAtualizar = async () => {
    setMensagemErro('');
    setMensagemSucesso('');

    if (!tipoProduto || produtos.length === 0 || horariosSelecionados.length === 0) {
      setMensagemErro('Preencha todos os campos e selecione pelo menos um horário.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const usuarioId = await AsyncStorage.getItem('usuarioId');

      const payload = {
        tipoProduto,
        produtos,
        horarioIds: horariosSelecionados,
        feiranteId: usuarioId,
        feiraId: feira.id,
      };

      const res = await axios.put(`${API_URL}/bancas/${bancaId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMensagemSucesso('Banca atualizada com sucesso!');
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        setMensagemErro(res.data.message || 'Erro ao atualizar banca.');
      }
    } catch (err) {
      console.error('Erro ao atualizar banca:', err);
      setMensagemErro('Erro na comunicação com o servidor.');
    }
  };

  if (carregando || !feira) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Atualizar Banca" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#004AAD" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Atualizar Banca" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />}
      >
        {mensagemErro && <Text style={styles.alertaErro}>❌ {mensagemErro}</Text>}
        {mensagemSucesso && <Text style={styles.alertaSucesso}>✅ {mensagemSucesso}</Text>}

        <Text style={styles.label}>📍 Feira Vinculada</Text>
        <View style={[styles.input, { backgroundColor: '#f0f0f0' }]}>
          <Text style={{ color: '#333' }}>{feira.nome}</Text>
        </View>

        <Text style={styles.label}>🕒 Selecione os horários</Text>
        {horariosDisponiveis.length === 0 && (
          <Text style={{ color: '#666', marginBottom: 10 }}>
            Nenhum horário disponível para essa feira.
          </Text>
        )}
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

        <Text style={styles.label}>🧺 Tipo de Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hortaliças"
          value={tipoProduto}
          onChangeText={setTipoProduto}
        />

        <Text style={styles.label}>📦 Produtos</Text>
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
        )}

        <TouchableOpacity style={styles.botao} onPress={handleAtualizar}>
          <Text style={styles.botaoTexto}>Atualizar Banca</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
    marginBottom: 10,
  },
  linhaProduto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  cardProdutos: {
    backgroundColor: '#F2F6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 20,
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

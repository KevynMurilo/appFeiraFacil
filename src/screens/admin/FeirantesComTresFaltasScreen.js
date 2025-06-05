import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function FeirantesComFaltasScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feiraId } = route.params;

  const [feirantes, setFeirantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  const carregarFeirantesComFaltas = async () => {
    if (mes && (isNaN(mes) || mes < 1 || mes > 12)) {
      Alert.alert('Erro', 'Informe um mês válido entre 1 e 12.');
      return;
    }

    if (ano && (isNaN(ano) || ano.length !== 4)) {
      Alert.alert('Erro', 'Informe um ano válido com 4 dígitos.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      let url = `${API_URL}/faltas/com-faltas/${feiraId}`;
      const params = [];

      if (statusSelecionado) params.push(`status=${statusSelecionado}`);
      if (mes) params.push(`mes=${mes}`);
      if (ano) params.push(`ano=${ano}`);

      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFeirantes(res.data.data);
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao buscar feirantes.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao buscar feirantes com faltas.');
    } finally {
      setLoading(false);
    }
  };

  const navegarParaDetalhes = (feiranteId) => {
    navigation.navigate('VerDetalhesFeirante', { feiranteId, idFila: null });
  };

  const navegarParaJustificativas = (feiranteId) => {
    navigation.navigate('VerJustificativasFeirante', { feiranteId });
  };

  const navegarParaProximoDaFila = (feiranteId) => {
    navigation.navigate('SubstituirFeirante', {
      feiranteId,
      feiraId,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Feirantes com Faltas" />

        <View style={styles.filtroContainer}>
          <Text style={styles.labelFiltro}>Filtrar por status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroStatusRow}>
            {[
              { label: 'Todos', value: '' },
              { label: 'PENDENTE', value: 'PENDENTE' },
              { label: 'RECUSADA', value: 'RECUSADA' },
              { label: 'ACEITA', value: 'ACEITA' },
            ].map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.statusBotao,
                  statusSelecionado === value && styles.statusBotaoAtivo,
                ]}
                onPress={() => setStatusSelecionado(value)}
              >
                <Text
                  style={[
                    styles.statusBotaoTexto,
                    statusSelecionado === value && styles.statusBotaoTextoAtivo,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.labelFiltro}>Mês:</Text>
          <TextInput
            placeholder="Ex: 5"
            keyboardType="numeric"
            value={mes}
            onChangeText={setMes}
            style={styles.input}
            returnKeyType="done"
          />

          <Text style={styles.labelFiltro}>Ano:</Text>
          <TextInput
            placeholder="Ex: 2024"
            keyboardType="numeric"
            value={ano}
            onChangeText={setAno}
            style={styles.input}
            returnKeyType="done"
          />

          <TouchableOpacity style={styles.botaoBuscar} onPress={carregarFeirantesComFaltas}>
            <Text style={styles.botaoTexto}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            {feirantes.length > 0 ? (
              feirantes.map((feirante, idx) => (
                <View key={idx} style={styles.card}>
                  <Text style={styles.nome}>{feirante.nome}</Text>
                  <Text style={styles.cpf}>CPF: {feirante.cpf}</Text>
                  <Text style={styles.faltas}>Total: {feirante.total}</Text>
                  <Text style={styles.faltasRecusadas}>Recusadas: {feirante.recusadas}</Text>
                  <Text style={styles.faltasPendentes}>Pendentes: {feirante.pendentes}</Text>
                  <Text style={styles.faltasAceitas}>Aceitas: {feirante.aceitas}</Text>

                  <TouchableOpacity style={styles.botao} onPress={() => navegarParaDetalhes(feirante.idFeirante)}>
                    <Text style={styles.botaoTexto}>Ver Detalhes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.botao, styles.botaoJustificativa]}
                    onPress={() => navegarParaJustificativas(feirante.idFeirante)}
                  >
                    <Text style={styles.botaoTexto}>Ver Justificativas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.botao, styles.botaoSubstituir]}
                    onPress={() => navegarParaProximoDaFila(feirante.idFeirante)}
                  >
                    <Text style={styles.botaoTexto}>Ver Próximo da Fila</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.nenhum}>
                Nenhum feirante encontrado com os filtros informados.
              </Text>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  filtroContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  labelFiltro: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#004AAD',
  },
  filtroStatusRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 4,
  },
  statusBotao: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  statusBotaoAtivo: {
    backgroundColor: '#004AAD',
  },
  statusBotaoTexto: {
    color: '#004AAD',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statusBotaoTextoAtivo: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#EEE',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  botaoBuscar: {
    backgroundColor: '#00AEEF',
    borderRadius: 6,
    paddingVertical: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  cpf: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  faltas: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  faltasRecusadas: {
    fontSize: 14,
    color: '#C62828',
    marginTop: 2,
  },
  faltasAceitas: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 2,
  },
  faltasPendentes: {
    fontSize: 14,
    color: '#FFA000',
    marginTop: 2,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  botaoJustificativa: {
    backgroundColor: '#888',
    marginTop: 8,
  },
  botaoSubstituir: {
    backgroundColor: '#00796B',
    marginTop: 8,
  },
  nenhum: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
});

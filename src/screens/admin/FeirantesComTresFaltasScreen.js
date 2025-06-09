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
  Modal,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function FeirantesComFaltasScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { horarioId } = route.params;

  const [feirantes, setFeirantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [feiranteSelecionado, setFeiranteSelecionado] = useState(null);
  const [acaoSelecionada, setAcaoSelecionada] = useState('');

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
      let url = `${API_URL}/faltas/com-faltas/horario/${horarioId}`;
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

  const abrirModal = (feirante, acao) => {
    setFeiranteSelecionado(feirante);
    setAcaoSelecionada(acao);
    setModalVisible(true);
  };

  const navegar = (bancaId) => {
    setModalVisible(false);
    if (acaoSelecionada === 'detalhes') {
      navigation.navigate('VerDetalhesFeirante', { feiranteId: feiranteSelecionado.idFeirante, bancaId });
    } else if (acaoSelecionada === 'justificativas') {
      navigation.navigate('VerJustificativasFeirante', { feiranteId: feiranteSelecionado.idFeirante, bancaId });
    } else if (acaoSelecionada === 'fila') {
      navigation.navigate('SubstituirFeirante', { feiranteId: feiranteSelecionado.idFeirante, horarioId, bancaId });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Feirantes com Faltas" />

        <View style={styles.filtroContainer}>
          <Text style={styles.labelFiltro}>Filtrar por status:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroStatusRow}>
            {[{ label: 'Todos', value: '' }, { label: 'PENDENTE', value: 'PENDENTE' }, { label: 'RECUSADA', value: 'RECUSADA' }, { label: 'ACEITA', value: 'ACEITA' }].map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[styles.statusBotao, statusSelecionado === value && styles.statusBotaoAtivo]}
                onPress={() => setStatusSelecionado(value)}
              >
                <Text style={[styles.statusBotaoTexto, statusSelecionado === value && styles.statusBotaoTextoAtivo]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.labelFiltro}>Mês:</Text>
          <TextInput placeholder="Ex: 5" keyboardType="numeric" value={mes} onChangeText={setMes} style={styles.input} />

          <Text style={styles.labelFiltro}>Ano:</Text>
          <TextInput placeholder="Ex: 2024" keyboardType="numeric" value={ano} onChangeText={setAno} style={styles.input} />

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

                  <TouchableOpacity style={styles.botao} onPress={() => abrirModal(feirante, 'detalhes')}>
                    <Text style={styles.botaoTexto}>Ver Detalhes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.botao, styles.botaoJustificativa]} onPress={() => abrirModal(feirante, 'justificativas')}>
                    <Text style={styles.botaoTexto}>Ver Justificativas</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.botao, styles.botaoSubstituir]} onPress={() => abrirModal(feirante, 'fila')}>
                    <Text style={styles.botaoTexto}>Ver Próximo da Fila</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.nenhum}>Nenhum feirante encontrado com os filtros informados.</Text>
            )}
          </ScrollView>
        )}

        {/* Modal para escolher banca */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escolha a banca de {feiranteSelecionado?.nome}</Text>
              {feiranteSelecionado?.bancas?.map((banca) => (
                <Pressable key={banca.id} style={styles.botaoHorario} onPress={() => navegar(banca.id)}>
                  <Text style={styles.botaoTexto}>{banca.tipoProduto}</Text>
                  <Text style={styles.botaoSubtexto}>{banca.produtos?.join(', ')}</Text>
                </Pressable>
              ))}
              <Pressable style={styles.cancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  filtroContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  labelFiltro: { fontWeight: 'bold', marginTop: 12, marginBottom: 4, color: '#004AAD' },
  filtroStatusRow: { flexDirection: 'row', marginBottom: 10, marginTop: 4 },
  statusBotao: { backgroundColor: '#E0E7FF', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginRight: 10 },
  statusBotaoAtivo: { backgroundColor: '#004AAD' },
  statusBotaoTexto: { color: '#004AAD', fontWeight: 'bold', fontSize: 13 },
  statusBotaoTextoAtivo: { color: '#fff' },
  input: { backgroundColor: '#EEE', borderRadius: 6, padding: 8, marginTop: 4 },
  botaoBuscar: { backgroundColor: '#00AEEF', borderRadius: 6, paddingVertical: 10, marginTop: 16, alignItems: 'center' },
  botaoTexto: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#F2F6FF', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#004AAD' },
  cpf: { fontSize: 14, color: '#555', marginTop: 5 },
  faltas: { fontSize: 14, color: '#000', marginTop: 4 },
  faltasRecusadas: { fontSize: 14, color: '#C62828', marginTop: 2 },
  faltasAceitas: { fontSize: 14, color: '#2E7D32', marginTop: 2 },
  faltasPendentes: { fontSize: 14, color: '#FFA000', marginTop: 2 },
  botao: { backgroundColor: '#004AAD', paddingVertical: 8, borderRadius: 6, marginTop: 12 },
  botaoJustificativa: { backgroundColor: '#888', marginTop: 8 },
  botaoSubstituir: { backgroundColor: '#00796B', marginTop: 8 },
  nenhum: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#555' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 4 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#004AAD', marginBottom: 12, textAlign: 'center' },
  botaoHorario: { backgroundColor: '#00AEEF', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginTop: 10 },
  botaoSubtexto: { color: '#fff', fontSize: 13, textAlign: 'center', marginTop: 2 },
  cancelar: { marginTop: 20, alignSelf: 'center' },
  cancelarTexto: { color: '#004AAD', fontWeight: 'bold' },
});
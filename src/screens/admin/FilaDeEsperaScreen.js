import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FilaDeEsperaScreen() {
  const [feiras, setFeiras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [feiraSelecionada, setFeiraSelecionada] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const carregarFeiras = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/feiras`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = response.data;
        if (res.success) {
          setFeiras(res.data);
        } else {
          setErro(res.message || 'Erro ao carregar feiras');
        }
      } catch (err) {
        setErro('Erro ao buscar feiras.');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };
    carregarFeiras();
  }, []);

  const abrirModalHorarios = (feira) => {
    setFeiraSelecionada(feira);
    setHorariosSelecionados(feira.horarios || []);
    setModalVisible(true);
  };

  const abrirFila = (horario) => {
    setModalVisible(false);
    navigation.navigate('VisualizarFilaEspera', { horario });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitulo}>
          Selecione uma feira e depois escolha o horário:
        </Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          feiras.map((feira) => (
            <TouchableOpacity
              key={feira.id}
              style={styles.card}
              onPress={() => abrirModalHorarios(feira)}
            >
              <Text style={styles.nome}>{feira.nome}</Text>
              <Text style={styles.info}><Text style={styles.label}>LOCAL:</Text> {feira.local}</Text>
              <Text style={styles.info}>
                <Text style={styles.label}>HORÁRIOS:</Text> {feira.horarios?.length || 0}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>FEIRANTES:</Text> {feira.quantidadeFeirantes}/{feira.maxFeirantes}
              </Text>
              <Text style={styles.info}>
                <Text style={styles.label}>FILA TOTAL:</Text> {feira.quantidadeFilaDeEspera}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal de seleção de horário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              Horários de {feiraSelecionada?.nome}
            </Text>

            {horariosSelecionados.length === 0 ? (
              <Text style={styles.vazio}>Nenhum horário cadastrado.</Text>
            ) : (
              horariosSelecionados.map((h) => (
                <Pressable
                  key={h.id}
                  style={styles.botaoHorario}
                  onPress={() => abrirFila(h)}
                >
                  <Text style={styles.botaoTexto}>
                    {h.dia} - {h.horarioInicio} às {h.horarioFim} | Fila: {h.quantidadeFilaDeEspera ?? 0}
                  </Text>
                </Pressable>
              ))
            )}

            <Pressable style={styles.cancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelarTexto}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 15,
  },
  subtitulo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#004AAD',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 12,
    textAlign: 'center',
  },
  botaoHorario: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelar: {
    marginTop: 20,
    alignSelf: 'center',
  },
  cancelarTexto: {
    color: '#004AAD',
    fontWeight: 'bold',
  },
  vazio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

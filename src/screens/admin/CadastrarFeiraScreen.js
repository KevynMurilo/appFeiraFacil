import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import TopoNavegacao from '../../components/TopoNavegacao';
import axios from 'axios';
import { API_URL } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const diasSemana = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];

const gerarHorarios = () => {
  const horas = [];
  for (let h = 6; h <= 22; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    horas.push(`${String(h).padStart(2, '0')}:30`);
  }
  return horas;
};

export default function CadastrarFeiraScreen() {
  const navigation = useNavigation();
  const [feira, setFeira] = useState({ nome: '', local: '', latitude: null, longitude: null });
  const [horarios, setHorarios] = useState([{ dia: '', horarioInicio: '', horarioFim: '', maxFeirantes: '' }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState({ index: 0, field: '', options: [] });

  const handleChange = (field, value) => setFeira({ ...feira, [field]: value });

  const handleHorarioChange = (index, field, value) => {
    const novosHorarios = [...horarios];
    novosHorarios[index][field] = value;
    setHorarios(novosHorarios);
  };

  const openPicker = (index, field, options) => {
    setPickerType({ index, field, options });
    setModalVisible(true);
  };

  const adicionarHorario = () => setHorarios([...horarios, { dia: '', horarioInicio: '', horarioFim: '', maxFeirantes: '' }]);

  const removerHorario = (index) => {
    const novosHorarios = [...horarios];
    novosHorarios.splice(index, 1);
    setHorarios(novosHorarios);
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setFeira({ ...feira, latitude, longitude });
  };

  const handleSalvar = async () => {
    const { nome, local, latitude, longitude } = feira;

    if (!nome || !local || latitude === null || longitude === null) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos da feira.');
      return;
    }

    for (let i = 0; i < horarios.length; i++) {
      const { dia, horarioInicio, horarioFim, maxFeirantes } = horarios[i];
      if (!dia || !horarioInicio || !horarioFim || !maxFeirantes) {
        Alert.alert('Campos obrigatórios', 'Preencha todos os campos de horário.');
        return;
      }

      const inicioMin = parseInt(horarioInicio.split(':')[0]) * 60 + parseInt(horarioInicio.split(':')[1]);
      const fimMin = parseInt(horarioFim.split(':')[0]) * 60 + parseInt(horarioFim.split(':')[1]);

      if (fimMin <= inicioMin) {
        Alert.alert('Horário inválido', `O fim deve ser após o início no item ${i + 1}.`);
        return;
      }
    }

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${API_URL}/feiras`,
        {
          nome,
          local,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          horarios: horarios.map((h) => ({
            dia: h.dia,
            horarioInicio: h.horarioInicio,
            horarioFim: h.horarioFim,
            maxFeirantes: parseInt(h.maxFeirantes),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert('Sucesso', 'Feira cadastrada com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao cadastrar a feira.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Cadastrar Feira" />
      <ScrollView contentContainerStyle={styles.container}>
        {[{ label: 'Nome da Feira', key: 'nome' }, { label: 'Local', key: 'local' }].map(({ label, key }) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={styles.input}
              value={feira[key]}
              onChangeText={(value) => handleChange(key, value)}
              placeholder={`Digite ${label.toLowerCase()}`}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <Text style={styles.label}>Horários da Feira</Text>
        {horarios.map((item, index) => (
          <View key={index} style={styles.horarioCard}>
            <View style={styles.horarioLinha}>
              <TouchableOpacity style={[styles.select, { flex: 1 }]} onPress={() => openPicker(index, 'dia', diasSemana)}>
                <Text style={styles.selectText}>{item.dia || 'Dia'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.select, { flex: 1 }]} onPress={() => openPicker(index, 'horarioInicio', gerarHorarios())}>
                <Text style={styles.selectText}>{item.horarioInicio || 'Início'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.select, { flex: 1 }]} onPress={() => openPicker(index, 'horarioFim', gerarHorarios())}>
                <Text style={styles.selectText}>{item.horarioFim || 'Fim'}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Máximo de feirantes nesse horário"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={item.maxFeirantes}
              onChangeText={(value) => handleHorarioChange(index, 'maxFeirantes', value)}
            />

            {horarios.length > 1 && (
              <TouchableOpacity onPress={() => removerHorario(index)} style={styles.botaoRemover}>
                <Ionicons name="trash-outline" size={22} color="#FF4D4F" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={adicionarHorario} style={styles.botaoAdicionar}>
          <Ionicons name="add" size={20} color="#004AAD" />
          <Text style={styles.addText}>Adicionar Horário</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Localização (clique no mapa)</Text>
        <MapView
          style={styles.map}
          initialRegion={{ latitude: -15.5392, longitude: -47.337, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
          onPress={handleMapPress}
        >
          {feira.latitude && feira.longitude && (
            <Marker coordinate={{ latitude: feira.latitude, longitude: feira.longitude }} />
          )}
        </MapView>
        <Text style={styles.coord}>
          {feira.latitude && feira.longitude
            ? `Lat: ${feira.latitude.toFixed(5)} | Long: ${feira.longitude.toFixed(5)}`
            : 'Clique no mapa para definir latitude e longitude'}
        </Text>

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Ionicons name="save" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Salvar Feira</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={pickerType.options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleHorarioChange(pickerType.index, pickerType.field, item);
                      setModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelar}>
                <Text style={styles.modalCancelarText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 40 },
  inputGroup: { marginBottom: 15 },
  label: { fontWeight: '600', color: '#004AAD', marginBottom: 4 },
  input: {
    backgroundColor: '#F2F6FF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#333',
    marginBottom: 10,
  },
  horarioCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  horarioLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  select: {
    backgroundColor: '#F2F6FF',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectText: { fontSize: 15, color: '#333' },
  botaoRemover: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 15,
  },
  addText: { color: '#004AAD', fontSize: 15, fontWeight: '500', marginLeft: 6 },
  map: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  coord: {
    textAlign: 'center',
    fontSize: 14,
    color: '#004AAD',
    marginBottom: 20,
  },
  botaoSalvar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancelar: {
    marginTop: 10,
  },
  modalCancelarText: {
    color: '#FF4D4F',
    textAlign: 'center',
    fontSize: 16,
  },
});

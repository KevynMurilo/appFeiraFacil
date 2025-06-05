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
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import TopoNavegacao from '../../components/TopoNavegacao';
import axios from 'axios';
import { API_URL } from '../../config/api';

const diasSemana = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"];

const gerarHorarios = () => {
  const horas = [];
  for (let h = 6; h <= 22; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    horas.push(`${String(h).padStart(2, '0')}:30`);
  }
  return horas;
};

export default function AtualizarFeiraScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feira: feiraOriginal } = route.params;

  const [feira, setFeira] = useState({
    id: feiraOriginal.id,
    nome: feiraOriginal.nome,
    local: feiraOriginal.local,
    maxFeirantes: String(feiraOriginal.maxFeirantes),
    latitude: parseFloat(feiraOriginal.latitude),
    longitude: parseFloat(feiraOriginal.longitude),
  });

  const [horarios, setHorarios] = useState(feiraOriginal.horarios || [{ dia: '', horarioInicio: '', horarioFim: '' }]);
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

  const adicionarHorario = () => setHorarios([...horarios, { dia: '', horarioInicio: '', horarioFim: '' }]);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setFeira({ ...feira, latitude, longitude });
  };

  const handleAtualizar = async () => {
    const { nome, local, maxFeirantes, latitude, longitude } = feira;
    if (!nome || !local || !maxFeirantes || latitude === null || longitude === null) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos da feira.');
      return;
    }
    if (horarios.some(h => !h.dia || !h.horarioInicio || !h.horarioFim)) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos de horário.');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/feiras/${feira.id}`, {
        ...feira,
        maxFeirantes: parseInt(maxFeirantes),
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        horarios
      });
      if (response.data.success) {
        Alert.alert('Sucesso', 'Feira atualizada com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao atualizar a feira.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Atualizar Feira" />
      <ScrollView contentContainerStyle={styles.container}>

        {[{ label: 'Nome da Feira', key: 'nome' }, { label: 'Local', key: 'local' }, { label: 'Máx. Feirantes', key: 'maxFeirantes', keyboard: 'numeric' }].map(({ label, key, keyboard }) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={styles.input}
              value={feira[key]}
              onChangeText={(value) => handleChange(key, value)}
              keyboardType={keyboard || 'default'}
              placeholder={`Digite ${label.toLowerCase()}`}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <Text style={styles.label}>Horários da Feira</Text>
        {horarios.map((item, index) => (
          <View key={index} style={styles.horarioCard}>
            <TouchableOpacity style={styles.select} onPress={() => openPicker(index, 'dia', diasSemana)}>
              <Text style={styles.selectText}>{item.dia || 'Selecionar dia'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.select} onPress={() => openPicker(index, 'horarioInicio', gerarHorarios())}>
              <Text style={styles.selectText}>{item.horarioInicio || 'Horário de Início'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.select} onPress={() => openPicker(index, 'horarioFim', gerarHorarios())}>
              <Text style={styles.selectText}>{item.horarioFim || 'Horário de Fim'}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={adicionarHorario} style={styles.botaoAdicionar}>
          <Ionicons name="add" size={20} color="#004AAD" />
          <Text style={styles.addText}>Adicionar Horário</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Localização (clique no mapa)</Text>
        <MapView
          style={styles.map}
          initialRegion={{ latitude: feira.latitude, longitude: feira.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
          onPress={handleMapPress}
        >
          <Marker coordinate={{ latitude: feira.latitude, longitude: feira.longitude }} />
        </MapView>
        <Text style={styles.coord}>
          {feira.latitude && feira.longitude
            ? `Lat: ${feira.latitude.toFixed(5)} | Long: ${feira.longitude.toFixed(5)}`
            : 'Clique no mapa para definir latitude e longitude'}
        </Text>

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleAtualizar}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Salvar Alterações</Text>
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
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    color: '#004AAD',
    marginBottom: 4,
  },
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
  select: {
    backgroundColor: '#F2F6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  horarioCard: {
    marginBottom: 20,
  },
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
  botaoAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 15,
  },
  addText: {
    color: '#004AAD',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
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
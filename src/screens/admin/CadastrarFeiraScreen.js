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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import TopoNavegacao from '../../components/TopoNavegacao';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function CadastrarFeiraScreen() {
  const navigation = useNavigation();

  const [feira, setFeira] = useState({
    nome: '',
    local: '',
    maxFeirantes: '',
    latitude: null,
    longitude: null,
  });

  const [horarios, setHorarios] = useState([
    { dia: '', horarioInicio: '', horarioFim: '' },
  ]);

  const handleChange = (field, value) => {
    setFeira({ ...feira, [field]: value });
  };

  const handleHorarioChange = (index, field, value) => {
    const novosHorarios = [...horarios];
    novosHorarios[index][field] = value.toUpperCase();
    setHorarios(novosHorarios);
  };

  const adicionarHorario = () => {
    setHorarios([...horarios, { dia: '', horarioInicio: '', horarioFim: '' }]);
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setFeira({ ...feira, latitude, longitude });
  };

  const handleSalvar = async () => {
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
      const response = await axios.post(`${API_URL}/feiras`, {
        nome,
        local,
        maxFeirantes: parseInt(maxFeirantes),
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        horarios
      });

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
        {[{ label: 'Nome da Feira', key: 'nome' },
          { label: 'Local', key: 'local' },
          { label: 'Máx. Feirantes', key: 'maxFeirantes', keyboard: 'numeric' },
        ].map(({ label, key, keyboard }) => (
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
            <TextInput
              style={styles.input}
              placeholder="Dia (ex: SABADO)"
              value={item.dia}
              onChangeText={(value) => handleHorarioChange(index, 'dia', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Início (ex: 07:00)"
              value={item.horarioInicio}
              onChangeText={(value) => handleHorarioChange(index, 'horarioInicio', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Fim (ex: 12:00)"
              value={item.horarioFim}
              onChangeText={(value) => handleHorarioChange(index, 'horarioFim', value)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={adicionarHorario} style={styles.botaoAdicionar}>
          <Ionicons name="add" size={20} color="#004AAD" />
          <Text style={styles.addText}>Adicionar Horário</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Localização (clique no mapa)</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -15.5392,
            longitude: -47.337,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
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
  horarioCard: { marginBottom: 15 },
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
  },
});

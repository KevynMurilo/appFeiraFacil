import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function AtualizarFeiraScreen({ navigation }) {
  const route = useRoute();
  const { feira: feiraOriginal } = route.params;

  const [feira, setFeira] = useState({ ...feiraOriginal });

  const handleChange = (field, value) => {
    setFeira({ ...feira, [field]: value });
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setFeira({ ...feira, latitude, longitude });
  };

  const handleAtualizar = () => {
    if (
      !feira.nome ||
      !feira.local ||
      !feira.diasSemana ||
      !feira.horario ||
      !feira.maxFeirantes ||
      feira.latitude === null ||
      feira.longitude === null
    ) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    console.log('Feira atualizada:', feira);
    Alert.alert('Sucesso', 'Feira atualizada com sucesso!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopoNavegacao titulo="Atualizar Feira" />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Atualizar Feira</Text>

        {[ 
          { label: 'Nome da Feira', key: 'nome' },
          { label: 'Local', key: 'local' },
          { label: 'Dias da Semana', key: 'diasSemana' },
          { label: 'Horário (ex: 07:00)', key: 'horario' },
          { label: 'Máx. Feirantes', key: 'maxFeirantes', keyboard: 'numeric' },
        ].map(({ label, key, keyboard }) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={styles.input}
              value={String(feira[key])}
              onChangeText={(value) => handleChange(key, value)}
              keyboardType={keyboard || 'default'}
              placeholder={`Digite ${label.toLowerCase()}`}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <Text style={styles.label}>Localização (clique no mapa para atualizar)</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(feira.latitude),
            longitude: parseFloat(feira.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(feira.latitude),
              longitude: parseFloat(feira.longitude),
            }}
            title={feira.nome}
          />
        </MapView>

        <Text style={styles.coord}>
          {feira.latitude && feira.longitude
            ? `Lat: ${parseFloat(feira.latitude).toFixed(5)} | Long: ${parseFloat(feira.longitude).toFixed(5)}`
            : 'Clique no mapa para definir latitude e longitude'}
        </Text>

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleAtualizar}>
          <Ionicons name="create" size={20} color="#fff" />
          <Text style={styles.botaoTexto}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 20,
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
});

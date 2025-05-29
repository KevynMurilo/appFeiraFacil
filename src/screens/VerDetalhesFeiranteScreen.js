import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

export default function VerDetalhesFeiraScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feira } = route.params;

  const latitude = parseFloat(feira.latitude);
  const longitude = parseFloat(feira.longitude);
  const vagasRestantes = feira.maxFeirantes - feira.feirantes.length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="#004AAD" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Detalhes da Feira</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.valor}>{feira.nome}</Text>

        <Text style={styles.label}>Local:</Text>
        <Text style={styles.valor}>{feira.local}</Text>

        <Text style={styles.label}>Dias da Semana:</Text>
        <Text style={styles.valor}>{feira.diasSemana}</Text>

        <Text style={styles.label}>Horário:</Text>
        <Text style={styles.valor}>{feira.horario}h</Text>

        <Text style={styles.label}>Feirantes Atuais / Limite:</Text>
        <Text style={styles.valor}>{feira.feirantes.length} / {feira.maxFeirantes}</Text>

        <Text style={styles.label}>Vagas Disponíveis:</Text>
        <Text style={styles.valor}>{vagasRestantes}</Text>
      </View>

      <Text style={styles.subtitulo}>Localização da Feira</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={feira.nome}
          description={feira.local}
          pinColor="#00AEEF" // pino azul bonito
        />
      </MapView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  voltar: {
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: '#004AAD',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
    marginTop: 10,
  },
  valor: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    marginBottom: 30,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
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

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir Feira',
      `Tem certeza que deseja excluir a feira "${feira.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Feira excluída com sucesso!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
          <Ionicons name="arrow-back" size={24} color="#004AAD" />
        </TouchableOpacity>

        <Text style={styles.titulo}>Detalhes da Feira</Text>

        <View style={styles.card}>
          <Info label="Nome" valor={feira.nome} />
          <Info label="Local" valor={feira.local} />
          <Info label="Dias da Semana" valor={feira.diasSemana} />
          <Info label="Horário" valor={`${feira.horario}h`} />
          <Info label="Feirantes Atuais / Limite" valor={`${feira.feirantes.length} / ${feira.maxFeirantes}`} />
          <Info label="Vagas Disponíveis" valor={vagasRestantes.toString()} />
        </View>

        <Text style={styles.subtitulo}>📍 Localização no Mapa</Text>
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
            description={`${feira.local} - Formosa/GO`}
            pinColor="#00AEEF"
          />
        </MapView>
        <Text style={styles.rodapeMapa}>Formosa - Goiás</Text>
      </ScrollView>

      <View style={styles.botoesFixos}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate('AtualizarFeira', { feira })}
        >
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.botaoTexto}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.botaoTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Info = ({ label, valor }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.valor}>{valor}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 120, // espaço pros botões fixos
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  voltar: {
    padding: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  titulo: {
    fontSize: 26,
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
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
    fontSize: 15,
  },
  valor: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  rodapeMapa: {
    textAlign: 'center',
    color: '#004AAD',
    marginBottom: 30,
    fontSize: 14,
    fontWeight: '500',
  },
  botoesFixos: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  botaoEditar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 6,
  },
  botaoExcluir: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    gap: 6,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

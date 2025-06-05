import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import TopoNavegacao from '../../components/TopoNavegacao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function VerDetalhesFeiraScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feira: feiraInicial } = route.params;
  const [feira, setFeira] = useState(feiraInicial);
  const [isAdmin, setIsAdmin] = useState(false);

  const latitude = parseFloat(feira.latitude);
  const longitude = parseFloat(feira.longitude);
  const vagasRestantes = feira.vagasDisponiveis;

  useFocusEffect(
    useCallback(() => {
      const carregarFeiraAtualizada = async () => {
        try {
          const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');
          setIsAdmin(tipoUsuario === 'ADMIN');

          const resposta = await axios.get(`${API_URL}/feiras/${feiraInicial.id}`);

          if (resposta.data.success) {
            setFeira(resposta.data.data);
          } else {
            Alert.alert('Erro', resposta.data.message || 'Erro ao buscar feira atualizada.');
          }
        } catch (erro) {
          console.error('Erro ao carregar feira:', erro);
          Alert.alert('Erro', 'Não foi possível atualizar os dados da feira.');
        }
      };

      carregarFeiraAtualizada();
    }, [feiraInicial.id])
  );

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir Feira',
      `Tem certeza que deseja excluir a feira "${feira.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const resposta = await axios.delete(`${API_URL}/feiras/${feira.id}`);
              if (resposta.data.success) {
                Alert.alert('✅ Feira excluída com sucesso!');
                navigation.goBack();
              } else {
                Alert.alert('❌ Erro', resposta.data.message);
              }
            } catch (erro) {
              Alert.alert('❌ Erro ao excluir a feira');
              console.error(erro);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Detalhes da Feira" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Info label="Nome" valor={feira.nome} />
          <Info label="Local" valor={feira.local} />
          <Info
            label="Horários"
            valor={feira.horarios.map(horario => `${horario.dia}: ${horario.horarioInicio} - ${horario.horarioFim}`).join('\n')}
          />
          <Info
            label="Feirantes Atuais / Limite"
            valor={`${feira.quantidadeFeirantes} / ${feira.maxFeirantes}`}
          />
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

        <View style={styles.botoesInferiores}>
          <TouchableOpacity
            style={styles.botaoMapa}
            onPress={() =>
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
            }
          >
            <Ionicons name="map-outline" size={18} color="#fff" />
            <Text style={styles.botaoTexto}>Abrir no Mapa</Text>
          </TouchableOpacity>

          {isAdmin && (
            <View style={styles.botoesAdmin}>
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
          )}
        </View>
      </ScrollView>
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
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
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
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  botoesInferiores: {
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
  },
  botaoMapa: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004AAD',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  botoesAdmin: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
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

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
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const latitude = parseFloat(feira.latitude);
  const longitude = parseFloat(feira.longitude);

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
      Alert.alert('Erro', 'Não foi possível atualizar os dados da feira.');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    carregarFeiraAtualizada();
  }, [feiraInicial.id]));

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarFeiraAtualizada();
  };

  const confirmarExclusao = () => {
    Alert.alert('Excluir Feira', `Tem certeza que deseja excluir a feira "${feira.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const resposta = await axios.delete(`${API_URL}/feiras/${feira.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (resposta.data.success) {
              Alert.alert('✅ Feira excluída com sucesso!');
              navigation.goBack();
            } else {
              Alert.alert('❌ Erro', resposta.data.message);
            }
          } catch (erro) {
            Alert.alert('❌ Erro ao excluir a feira');
          }
        },
      },
    ]);
  };

  const subirFeiranteDoHorario = async (idHorario) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const resposta = await axios.patch(
        `${API_URL}/feiras/subir-fila/${idHorario}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resposta.data.success) {
        Alert.alert('✅ Feirante ativado com sucesso!');
        carregarFeiraAtualizada();
      } else {
        Alert.alert('❌ Erro', resposta.data.message);
      }
    } catch (erro) {
      Alert.alert('❌ Erro ao subir feirante da fila');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Detalhes da Feira" />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
        }
      >
        <View style={styles.card}>
          <Info label="Nome" valor={feira.nome} />
          <Info label="Local" valor={feira.local} />
        </View>

        <Text style={styles.subtitulo}>🕐 Horários Disponíveis</Text>
        {feira.horarios.length === 0 ? (
          <Text style={styles.vazio}>Nenhum horário cadastrado.</Text>
        ) : (
          feira.horarios.map((h) => (
            <View key={h.id} style={styles.horarioCard}>
              <Text style={styles.horarioTexto}>
                {h.dia} - {h.horarioInicio} às {h.horarioFim}
              </Text>
              <Text style={styles.horarioInfo}>
                {h.quantidadeFeirantes}/{h.maxFeirantes} ocupadas | Fila: {h.quantidadeFilaDeEspera}
              </Text>

              {/* Mostra botão de subir feirante somente se admin, houver fila e vaga */}
              {isAdmin && h.vagasDisponiveis > 0 && h.quantidadeFilaDeEspera > 0 && (
                <TouchableOpacity
                  style={styles.botaoSubirHorario}
                  onPress={() => subirFeiranteDoHorario(h.id)}
                >
                  <Ionicons name="trending-up-outline" size={16} color="#fff" />
                  <Text style={styles.subirTexto}>Subir da Fila</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

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
            description={feira.local}
            pinColor="#00AEEF"
          />
        </MapView>
        <Text style={styles.rodapeMapa}>Formosa - Goiás</Text>

        <View style={styles.botoesArea}>
          {isAdmin ? (
            <>
              <View style={styles.linhaBotoes}>
                <TouchableOpacity
                  style={[styles.botao, styles.botaoAtualizar]}
                  onPress={() => navigation.navigate('AtualizarFeira', { feira })}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.botaoTexto}>Atualizar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.botao, styles.botaoExcluir]} onPress={confirmarExclusao}>
                  <Ionicons name="trash-outline" size={18} color="#fff" />
                  <Text style={styles.botaoTexto}>Excluir</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.botaoGrande, styles.botaoMapaBorda]}
                onPress={() =>
                  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
                }
              >
                <Ionicons name="map-outline" size={20} color="#004AAD" />
                <Text style={styles.botaoTextoMapa}>Abrir Mapa</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.botaoGrande, styles.botaoMapa]}
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`)
              }
            >
              <Ionicons name="map-outline" size={20} color="#fff" />
              <Text style={styles.botaoTexto}>Abrir no Mapa</Text>
            </TouchableOpacity>
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
  container: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 30, marginBottom: 10, color: '#004AAD' },
  card: { backgroundColor: '#F2F6FF', padding: 20, borderRadius: 12, elevation: 2 },
  label: { fontWeight: 'bold', color: '#004AAD', fontSize: 15 },
  valor: { fontSize: 16, color: '#333' },
  map: { width: '100%', height: 250, borderRadius: 12, marginBottom: 10 },
  rodapeMapa: { textAlign: 'center', color: '#004AAD', marginBottom: 10, fontSize: 14 },
  botoesArea: { marginTop: 30, marginBottom: 50, gap: 16 },
  linhaBotoes: { flexDirection: 'row', gap: 12 },
  botao: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 10, gap: 6,
  },
  botaoAtualizar: { backgroundColor: '#00AEEF' },
  botaoExcluir: { backgroundColor: '#FF4D4F' },
  botaoMapa: { backgroundColor: '#004AAD' },
  botaoMapaBorda: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#004AAD' },
  botaoGrande: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 12, gap: 8,
  },
  botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoTextoMapa: { color: '#004AAD', fontWeight: 'bold', fontSize: 16 },
  vazio: { color: '#777', fontStyle: 'italic' },
  horarioCard: {
    backgroundColor: '#E9F1FF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  horarioTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#004AAD',
  },
  horarioInfo: {
    fontSize: 14,
    color: '#333',
  },
  botaoSubirHorario: {
    marginTop: 6,
    backgroundColor: '#004AAD',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  subirTexto: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

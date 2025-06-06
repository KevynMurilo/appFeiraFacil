import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function GerenciarFeirasScreen() {
  const navigation = useNavigation();
  const [feiras, setFeiras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mostrarBotaoNovaFeira, setMostrarBotaoNovaFeira] = useState(false);

  const carregarFeiras = async () => {
    try {
      setLoading(true);
      const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');
      setMostrarBotaoNovaFeira(tipoUsuario === 'ADMIN');

      const response = await axios.get(`${API_URL}/feiras`);
      const json = response.data;

      if (json.success && json.data) {
        setFeiras(json.data);
      } else {
        setFeiras([]);
      }
    } catch (err) {
      console.error('Erro ao buscar feiras:', err);
      setFeiras([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarFeiras();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarFeiras();
  }, []);

  const renderFeira = (feira) => (
    <View key={feira.id} style={styles.card}>
      <Text style={styles.nome}>{feira.nome}</Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Local:</Text> {feira.local}
      </Text>

      <Text style={styles.label}>Horários:</Text>
      {feira.horarios.length === 0 ? (
        <Text style={styles.horarioVazio}>Nenhum horário cadastrado.</Text>
      ) : (
        feira.horarios.map((h) => (
          <View key={h.id} style={styles.horarioBox}>
            <Text style={styles.horarioTexto}>
              🗓 {h.dia} | ⏰ {h.horarioInicio} - {h.horarioFim}
            </Text>
            <Text style={styles.horarioSub}>
              Feirantes: {h.quantidadeFeirantes}/{h.maxFeirantes} | Fila: {h.quantidadeFilaDeEspera}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('VerDetalhesFeira', { feira })}
      >
        <Text style={styles.botaoTexto}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {mostrarBotaoNovaFeira && (
        <View style={styles.acoesContainer}>
          <TouchableOpacity
            style={styles.botaoNovaFeira}
            onPress={() => navigation.navigate('CadastrarFeira')}
          >
            <Ionicons name="add-circle-outline" size={22} color="#00AEEF" />
            <Text style={styles.botaoNovaFeiraTexto}>Nova Feira</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !refreshing ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#004AAD" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#004AAD']} />
          }
        >
          {feiras.length === 0 ? (
            <Text style={styles.msgVazia}>Nenhuma feira encontrada.</Text>
          ) : (
            feiras.map(renderFeira)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  acoesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  botaoNovaFeira: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  botaoNovaFeiraTexto: {
    marginLeft: 6,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  msgVazia: {
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
    fontSize: 15,
    marginTop: 8,
  },
  horarioBox: {
    backgroundColor: '#E9F1FF',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  horarioTexto: {
    fontSize: 14,
    color: '#004AAD',
    fontWeight: '600',
  },
  horarioSub: {
    fontSize: 13,
    color: '#333',
  },
  horarioVazio: {
    color: '#777',
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 4,
  },
  botao: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

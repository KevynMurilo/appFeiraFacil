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
import { useCallback, useState } from 'react';

export default function GerenciarFeirasScreen() {
  const navigation = useNavigation();
  const [feiras, setFeiras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarFeiras = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://10.1.59.59:8080/api/feiras');
      const json = await res.json();
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

  const renderFeira = (feira) => {
    const vagasOcupadas = feira.quantidadeFeirantes;
    const vagas = feira.vagasDisponiveis;

    return (
      <View key={feira.id} style={styles.card}>
        <Text style={styles.nome}>{feira.nome}</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Local:</Text> {feira.local}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Dias:</Text> {feira.diasSemana}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Horário:</Text> {feira.horario}h
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Vagas:</Text> {vagasOcupadas}/{feira.maxFeirantes} ocupadas
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('VerDetalhesFeira', { feira })}
        >
          <Text style={styles.botaoTexto}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.acoesContainer}>
        <TouchableOpacity
          style={styles.botaoNovaFeira}
          onPress={() => navigation.navigate('CadastrarFeira')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#00AEEF" />
          <Text style={styles.botaoNovaFeiraTexto}>Nova Feira</Text>
        </TouchableOpacity>
      </View>

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
  },
  botao: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

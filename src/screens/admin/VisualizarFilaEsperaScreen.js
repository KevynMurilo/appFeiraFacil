import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import axios from 'axios';
import TopoNavegacao from '../../components/TopoNavegacao';
import { useNavigation } from '@react-navigation/native';

export default function VisualizarFilaEsperaScreen({ route }) {
  const { feira } = route.params;
  const [fila, setFila] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const navigation = useNavigation();

  const buscarFila = async () => {
    setCarregando(true);
    try {
      const response = await axios.get(
        `http://10.1.59.59:8080/api/fila-espera/feira/${feira.id}`
      );
      const res = response.data;
      if (res.success) {
        setFila(res.data);
      } else {
        setErro(res.message || 'Erro ao buscar fila');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao buscar fila de espera.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarFila();
  }, [feira]);

  const abrirWhatsApp = (numero) => {
    const url = `https://wa.me/55${numero}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.')
    );
  };

  const ativarFeirante = async (idFila) => {
    try {
      await axios.patch(
        `http://10.1.59.59:8080/api/fila-espera/${idFila}/status?status=ATIVO`
      );
      Alert.alert('Sucesso', 'Feirante ativado com sucesso!');
      buscarFila();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao ativar feirante.');
    }
  };

  const verDetalhes = (feiranteId) => {
    navigation.navigate('VerDetalhesFeirante', { feiranteId });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo={`Fila de Espera - ${feira.nome}`} />

      {carregando && fila.length === 0 ? (
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 30 }} />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : fila.length === 0 ? (
        <Text style={styles.vazio}>Nenhum feirante na fila.</Text>
      ) : (
        <FlatList
          data={fila}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          refreshing={carregando}
          onRefresh={buscarFila}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>👤 {item.nomeFeirante}</Text>

              <TouchableOpacity onPress={() => abrirWhatsApp(item.telefoneFeirante)}>
                <Text style={[styles.info, styles.link]}>
                  📞 {item.telefoneFeirante}
                </Text>
              </TouchableOpacity>

              <Text style={styles.info}>📍 Posição: {item.posicao}</Text>
              <Text style={styles.info}>📌 Status: {item.status}</Text>

              <View style={styles.botoesContainer}>
                {item.status !== 'ATIVO' && (
                  <TouchableOpacity
                    style={styles.botaoAtivar}
                    onPress={() => ativarFeirante(item.id)}
                  >
                    <Text style={styles.botaoTexto}>Ativar</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.botaoDetalhes}
                  onPress={() => verDetalhes(item.feiranteId)}
                >
                  <Text style={styles.botaoTexto}>Ver Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#E6F7FD',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00AEEF',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  botaoAtivar: {
    flex: 1,
    backgroundColor: '#004AAD',
    paddingVertical: 8,
    borderRadius: 6,
  },
  botaoDetalhes: {
    flex: 1,
    backgroundColor: '#00AEEF',
    paddingVertical: 8,
    borderRadius: 6,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  vazio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

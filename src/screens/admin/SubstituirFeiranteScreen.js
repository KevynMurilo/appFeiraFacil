import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function SubstituirFeiranteScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { feiranteId, feiraId } = route.params;

  const [feirante, setFeirante] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const buscarFeirante = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `http://192.168.18.17:8080/api/feirantes/${feiranteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setFeirante(res.data.data);
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao buscar feirante.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao buscar os dados do feirante.');
    } finally {
      setCarregando(false);
    }
  };

  const substituirFeirante = async () => {
    Alert.alert(
      'Confirmar substituição',
      'Deseja realmente substituir este feirante pelo próximo da fila?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Substituir',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.post(
                `http://192.168.18.17:8080/api/fila-espera/substituir/${feiraId}?feiranteId=${feiranteId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert('Sucesso', 'Feirante substituído com sucesso!');
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert('Erro', 'Erro ao substituir feirante.');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    buscarFeirante();
  }, []);

  if (carregando) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!feirante) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.erro}>Erro ao carregar os dados do feirante.</Text>
      </SafeAreaView>
    );
  }

  const bancasPorFeira = feirante.bancas?.reduce((map, banca) => {
    const nome = banca.nomeFeira || 'Feira não identificada';
    if (!map[nome]) map[nome] = [];
    map[nome].push(banca);
    return map;
  }, {});

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Substituir Feirante" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={24} color="#004AAD" />
            <Text style={styles.cardTitulo}>Informações do Feirante</Text>
          </View>

          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valor}>{feirante.nome}</Text>

          <Text style={styles.label}>CPF</Text>
          <Text style={styles.valor}>{feirante.cpf}</Text>

          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.valor}>{feirante.telefone}</Text>

          <Text style={styles.label}>Ativo</Text>
          <Text style={styles.valor}>{feirante.ativo ? 'Sim' : 'Não'}</Text>

          <Text style={styles.label}>Data de Cadastro</Text>
          <Text style={styles.valor}>
            {new Date(feirante.dataCadastro).toLocaleDateString('pt-BR')}
          </Text>

          <TouchableOpacity style={styles.botaoSubstituir} onPress={substituirFeirante}>
            <Text style={styles.botaoTexto}>Substituir por Próximo da Fila</Text>
          </TouchableOpacity>
        </View>

        {bancasPorFeira &&
          Object.entries(bancasPorFeira).map(([feira, bancas], idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="storefront-outline" size={22} color="#004AAD" />
                <Text style={styles.cardTitulo}>{feira}</Text>
              </View>

              {bancas.map((banca, i) => (
                <View key={i} style={styles.bancaContainer}>
                  <Text style={styles.label}>Tipo de Produto</Text>
                  <Text style={styles.valor}>{banca.tipoProduto}</Text>

                  <Text style={styles.label}>Produtos</Text>
                  <View style={styles.listaProdutos}>
                    {banca.produtos?.map((prod, j) => (
                      <View key={j} style={styles.produtoBadge}>
                        <Text style={styles.produtoTexto}>{prod}</Text>
                      </View>
                    ))}
                  </View>

                  {i < bancas.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 30, flexGrow: 1 },
  card: {
    backgroundColor: '#F2F6FF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: '#004AAD',
  },
  valor: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  listaProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  produtoBadge: {
    backgroundColor: '#00AEEF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  produtoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bancaContainer: { marginBottom: 15 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 15,
  },
  erro: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    marginTop: 40,
  },
  botaoSubstituir: {
    backgroundColor: '#D32F2F',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

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
  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import TopoNavegacao from '../../components/TopoNavegacao';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/api';

export default function VerDetalhesFeiranteScreen() {
  const route = useRoute();
  const { feiranteId } = route.params;

  const [feirante, setFeirante] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const buscarFeirante = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/feirantes/${feiranteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setFeirante(res.data.data);
      } else {
        Alert.alert('Erro', res.data.message || 'Erro ao buscar feirante.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do feirante.');
    } finally {
      setCarregando(false);
    }
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

  const statusLabel = {
    ATIVO: 'Ativo na feira',
    INATIVO: 'Inativo',
    SUBSTITUIDO_POR_FALTAS: 'Substituído por faltas',
    AGUARDANDO_REVISÃO: 'Aguardando revisão',
    BLOQUEADO: 'Bloqueado',
    NA_FILA_DE_ESPERA: 'Na fila de espera',
  };

  const statusCor = {
    ATIVO: '#388E3C',
    INATIVO: '#757575',
    SUBSTITUIDO_POR_FALTAS: '#D32F2F',
    AGUARDANDO_REVISÃO: '#F9A825',
    BLOQUEADO: '#C62828',
    NA_FILA_DE_ESPERA: '#1976D2',
  };

  const InfoItem = ({ label, valor, tipo }) => {
    const isLink = tipo === 'telefone' || tipo === 'email';
    const handlePress = () => {
      if (tipo === 'telefone') Linking.openURL(`tel:${valor}`);
      if (tipo === 'email') Linking.openURL(`mailto:${valor}`);
    };

    return (
      <TouchableOpacity disabled={!isLink} onPress={handlePress} activeOpacity={0.7}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.linkContainer}>
          <Text
            style={[
              styles.valor,
              isLink && styles.linkTexto,
            ]}
          >
            {valor}
          </Text>
          {isLink && (
            <Ionicons
              name={tipo === 'telefone' ? 'call-outline' : 'mail-outline'}
              size={16}
              color="#004AAD"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Feirante" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={24} color="#004AAD" />
            <Text style={styles.cardTitulo}>Informações Pessoais</Text>
          </View>

          <InfoItem label="Nome" valor={feirante.nome} />
          <InfoItem label="CPF" valor={feirante.cpf} />
          <InfoItem label="E-mail" valor={feirante.email} tipo="email" />
          <InfoItem label="Telefone" valor={feirante.telefone} tipo="telefone" />

          <Text style={styles.label}>Status</Text>
          <Text style={[styles.valor, { color: statusCor[feirante.status] || '#333', fontWeight: 'bold' }]}>
            {statusLabel[feirante.status] || feirante.status}
          </Text>

          <Text style={styles.label}>Data de Cadastro</Text>
          <Text style={styles.valor}>
            {new Date(feirante.dataCadastro).toLocaleDateString('pt-BR')}
          </Text>
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
  linkTexto: {
    color: '#004AAD',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

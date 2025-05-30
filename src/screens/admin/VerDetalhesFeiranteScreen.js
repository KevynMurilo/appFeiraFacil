import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function VerDetalhesFeiranteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { feirante } = route.params;

  if (!feirante) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.erro}>Erro ao carregar os dados do feirante.</Text>
      </SafeAreaView>
    );
  }

  // Agrupar bancas por feira
  const bancasPorFeira = feirante.bancas?.reduce((map, banca) => {
    const feira = banca.nomeFeira || 'Feira não identificada';
    if (!map[feira]) map[feira] = [];
    map[feira].push(banca);
    return map;
  }, {});

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Feirante" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Informações pessoais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={24} color="#004AAD" />
            <Text style={styles.cardTitulo}>Informações Pessoais</Text>
          </View>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valor}>{feirante.nome}</Text>

          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.valor}>{feirante.email}</Text>

          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.valor}>{feirante.telefone}</Text>
        </View>

        {/* Bancas organizadas por feira */}
        {bancasPorFeira &&
          Object.entries(bancasPorFeira).map(([feira, bancas], idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={22}
                  color="#004AAD"
                />
                <Text style={styles.cardTitulo}>{feira}</Text>
              </View>

              {bancas.map((banca, index) => (
                <View key={index} style={styles.bancaContainer}>
                  <Text style={styles.label}>Tipo de Produto</Text>
                  <Text style={styles.valor}>{banca.tipoProduto}</Text>

                  <Text style={styles.label}>Produtos</Text>
                  <View style={styles.listaProdutos}>
                    {banca.produtos?.map((prod, i) => (
                      <View key={i} style={styles.produtoBadge}>
                        <Text style={styles.produtoTexto}>{prod}</Text>
                      </View>
                    ))}
                  </View>

                  {index < bancas.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    paddingBottom: 30,
    flexGrow: 1,
  },
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
  bancaContainer: {
    marginBottom: 15,
  },
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

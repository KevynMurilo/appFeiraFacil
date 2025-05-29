import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
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

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Feirante" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Card de dados pessoais */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color="#004AAD"
            />
            <Text style={styles.cardTitulo}>Informações Pessoais</Text>
          </View>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valor}>{feirante.nome}</Text>

          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.valor}>{feirante.email}</Text>

          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.valor}>{feirante.telefone}</Text>
        </View>

        {/* Card de feiras */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="storefront-outline"
              size={22}
              color="#004AAD"
            />
            <Text style={styles.cardTitulo}>Feiras Vinculadas</Text>
          </View>
          {feirante.feiras?.map((feira, idx) => (
            <Text key={idx} style={styles.valor}>
              • {feira.nome}
            </Text>
          ))}
        </View>

        {/* Card da banca */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="box-open" size={20} color="#004AAD" />
            <Text style={styles.cardTitulo}>Banca</Text>
          </View>
          <Text style={styles.label}>Tipo de Produto</Text>
          <Text style={styles.valor}>{feirante.banca?.tipoProduto}</Text>

          <Text style={styles.label}>Produtos</Text>
          <View style={styles.listaProdutos}>
            {feirante.banca?.produtos?.map((prod, i) => (
              <View key={i} style={styles.produtoBadge}>
                <Text style={styles.produtoTexto}>{prod}</Text>
              </View>
            ))}
          </View>
        </View>
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
    borderRadius: 10,
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
  erro: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    marginTop: 40,
  },
});

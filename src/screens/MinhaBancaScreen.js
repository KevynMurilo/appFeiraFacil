import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VerBancaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { banca } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão Voltar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>←</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Detalhes da Banca</Text>

      <View style={styles.card}>
        <View style={styles.linha}>
          <Text style={styles.emoji}>🧺</Text>
          <View style={styles.textoLinha}>
            <Text style={styles.label}>Tipo de Produto</Text>
            <Text style={styles.valor}>{banca.tipoProduto}</Text>
          </View>
        </View>

        <View style={styles.linha}>
          <Text style={styles.emoji}>📦</Text>
          <View style={styles.textoLinha}>
            <Text style={styles.label}>Produtos</Text>
            {banca.produtos.map((produto, index) => (
              <Text key={index} style={styles.valor}>• {produto}</Text>
            ))}
          </View>
        </View>

        <View style={styles.linha}>
          <Text style={styles.emoji}>📍</Text>
          <View style={styles.textoLinha}>
            <Text style={styles.label}>Feira</Text>
            <Text style={styles.valor}>{banca.feira?.nome || 'Não informado'}</Text>
          </View>
        </View>
      </View>

      {/* Botão QR Code */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('VerQrCode', { qrCode: banca.qrCode })}
      >
        <Text style={styles.botaoTexto}>📤 Ver QR Code da Banca</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  voltar: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 1,
  },
  voltarTexto: {
    color: '#004AAD',
    fontSize: 26,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 22,
    marginRight: 10,
    marginTop: 2,
  },
  textoLinha: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 15,
    marginBottom: 4,
  },
  valor: {
    color: '#444',
    fontSize: 15,
    lineHeight: 20,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

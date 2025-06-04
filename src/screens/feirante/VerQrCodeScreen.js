import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import TopoNavegacao from '../../components/TopoNavegacao';

export default function VerQrCodeScreen() {
  const route = useRoute();
  const { qrCode } = route.params;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrCode}`;

  const handleCompartilhar = async () => {
    try {
      await Share.share({
        message: 'Aqui está meu QR Code de check-in na feira!',
        url: qrCodeUrl,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Seu QR Code" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: qrCodeUrl }}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={styles.infoTexto}>
            📌 Mostre este QR Code para fazer seu check-in
          </Text>
        </View>

        <TouchableOpacity style={styles.botaoCompartilhar} onPress={handleCompartilhar}>
          <Text style={styles.botaoTexto}>📤 Compartilhar QR Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 40,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },
  infoTexto: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  botaoCompartilhar: {
    backgroundColor: '#00AEEF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VerQrCodeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { qrCode } = route.params;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`;

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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Text style={styles.voltarTexto}>←</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Seu QR Code</Text>

      <View style={styles.card}>
        <Image source={{ uri: qrCodeUrl }} style={styles.qrImage} resizeMode="contain" />
        <Text style={styles.infoTexto}>📌 Mostre este QR Code para fazer seu check-in</Text>
      </View>

      <TouchableOpacity style={styles.botaoCompartilhar} onPress={handleCompartilhar}>
        <Text style={styles.botaoTexto}>📤 Compartilhar QR Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
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
    marginBottom: 30,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    marginBottom: 40,
    width: '100%',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  infoTexto: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
  },
  botaoCompartilhar: {
    backgroundColor: '#004AAD',
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

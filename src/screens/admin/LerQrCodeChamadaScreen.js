import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LerQrCodeChamadaScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.msgPermissao}>Carregando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera-outline" size={64} color="#004AAD" style={{ marginBottom: 20 }} />
        <Text style={styles.msgPermissao}>Precisamos da sua permissão para usar a câmera.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.botaoPermissao}>
          <Text style={styles.botaoTexto}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    // Redireciona para tela de confirmação com o QR Code
    navigation.navigate('ConfirmarCheckin', { qrCode: data });

    // Você pode liberar o scanner após alguns segundos se quiser reativar
    setTimeout(() => setScanned(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>
        <Text style={styles.instrucao}>📷 Aponte a câmera para o QR Code</Text>
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
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  msgPermissao: {
    fontSize: 17,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  botaoPermissao: {
    marginTop: 20,
    backgroundColor: '#004AAD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#004AAD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraContainer: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#004AAD33',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  camera: {
    flex: 1,
  },
  instrucao: {
    marginTop: 20,
    fontSize: 16,
    color: '#004AAD',
    fontWeight: '500',
    textAlign: 'center',
  },
});

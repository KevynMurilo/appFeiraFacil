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
          <Ionicons name="lock-open-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.botaoTexto}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);

    navigation.navigate('ConfirmarCheckin', { qrCode: data });

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
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7ff',
    paddingHorizontal: 30,
  },
  msgPermissao: {
    fontSize: 17,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  botaoPermissao: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#004AAD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
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
    height: 420,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 25,
    borderWidth: 2,
    borderColor: '#004AAD22',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: '#e9efff',
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

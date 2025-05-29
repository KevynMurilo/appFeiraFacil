import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeAdminScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: () => navigation.replace('Login'),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Botão de Sair */}
      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
        <Text style={styles.sairTexto}>⎋ Sair</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Olá, Administrador 👋</Text>
        <Text style={styles.subtitulo}>O que deseja gerenciar hoje?</Text>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('GerenciarFeirantes')}>
          <Text style={styles.botaoTexto}>👥 Gerenciar Feirantes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('GerenciarFeiras')}>
          <Text style={styles.botaoTexto}>🛒 Gerenciar Feiras</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('LerQrCode')}>
          <Text style={styles.botaoTexto}>📷 Fazer Chamada (QR Code)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  botaoSair: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f33',
    borderRadius: 6,
  },
  sairTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 25,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

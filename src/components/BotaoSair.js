import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BotaoSair() {
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
    <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
      <Text style={styles.sairTexto}>⎋ Sair</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botaoSair: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#D32F2F',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sairTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

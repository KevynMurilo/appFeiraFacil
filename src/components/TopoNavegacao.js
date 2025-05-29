import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TopoNavegacao({ titulo, exibirVoltar = true }) {
  const navigation = useNavigation();

  return (
    <View style={styles.topo}>
      {exibirVoltar && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Text style={styles.titulo}>{titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    backgroundColor: '#004AAD',
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voltar: {
    marginRight: 10,
  },
  titulo: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

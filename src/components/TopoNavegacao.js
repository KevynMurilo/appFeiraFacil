import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TopoNavegacao({ titulo, exibirVoltar = true }) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.topo}>
        {exibirVoltar && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
            <Ionicons name="arrow-back-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        )}
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
  },
  topo: {
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  voltar: {
    marginRight: 8,
    padding: 4,
  },
  titulo: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
});

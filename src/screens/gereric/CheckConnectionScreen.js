import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function CheckConnectionScreen({ navigation }) {
  const [conectado, setConectado] = useState(null);

  const verificarConexao = async () => {
    const state = await NetInfo.fetch();
    setConectado(state.isConnected);
    if (state.isConnected) {
      setTimeout(() => {
        navigation.replace('Splash');
      }, 1000);
    }
  };

  useEffect(() => {
    verificarConexao();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/conexao.gif')}
        style={styles.imagem}
        resizeMode="contain"
      />
      <Text style={styles.texto}>
        {conectado === false ? 'Sem conexão com a internet.' : 'Verificando conexão...'}
      </Text>
      {conectado === false ? (
        <TouchableOpacity onPress={verificarConexao} style={styles.botao}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="large" color="#fff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00244c',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imagem: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  texto: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
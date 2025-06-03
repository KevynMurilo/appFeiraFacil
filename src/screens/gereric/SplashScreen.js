import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const verificarLogin = async () => {
      const dataLoginStr = await AsyncStorage.getItem('dataHoraLogin');
      const tipoUsuario = await AsyncStorage.getItem('tipoUsuario');

      if (dataLoginStr && tipoUsuario) {
        const dataLogin = new Date(dataLoginStr);
        const agora = new Date();
        const diffHoras = (agora - dataLogin) / (1000 * 60 * 60);

        if (diffHoras < 12) {
          if (tipoUsuario === 'FEIRANTE') {
            navigation.replace('FeiranteDrawer');
            return;
          } else if (tipoUsuario === 'ADMIN') {
            navigation.replace('AdminDrawer');
            return;
          }
        }
      }

      navigation.replace('Login');
    };

    verificarLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#004AAD" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

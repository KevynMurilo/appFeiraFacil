import { Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { conectarWebSocket } from './websocket';

export const iniciarWebSocketComNotificacoes = async () => {
  const usuarioId = await AsyncStorage.getItem('usuarioId');

  if (usuarioId) {
    conectarWebSocket(usuarioId, (mensagem) => {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(mensagem, ToastAndroid.LONG, ToastAndroid.TOP);
      }

      showMessage({
        message: '📢 Nova Solicitação',
        description: mensagem,
        type: 'info',
        icon: 'auto',
        duration: 4000,
      });
    });
  }
};

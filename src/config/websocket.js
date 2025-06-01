import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const conectarWebSocket = (usuarioId, onMessage) => {
  const socket = new SockJS('http://192.168.18.17:8080/ws');

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[WS] Conectado');

      stompClient.subscribe(`/topic/substitutos/${usuarioId}`, (mensagem) => {
        console.log('[WS] Mensagem recebida:', mensagem.body);
        onMessage(mensagem.body);
      });
    },
    onStompError: (frame) => {
      console.error('[WS] Erro STOMP:', frame.headers['message'], frame.body);
    },
    onWebSocketClose: () => {
      console.warn('[WS] Conexão fechada');
    },
    onDisconnect: () => {
      console.warn('[WS] Desconectado do servidor');
    }
  });

  stompClient.activate();
};

export const desconectarWebSocket = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
    console.log('[WS] WebSocket desconectado');
  }
};

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';

import { iniciarWebSocketComNotificacoes } from './src/config/websocketNotificacao';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadastroFeiranteScreen from './src/screens/feirante/CadastroFeiranteScreen';
import VerDetalhesFeiranteScreen from './src/screens/admin/VerDetalhesFeiranteScreen';
import CadastrarFeiraScreen from './src/screens/admin/CadastrarFeiraScreen';
import AtualizarFeiraScreen from './src/screens/admin/AtualizarFeiraScreen';
import VerDetalhesFeiraScreen from './src/screens/admin/VerDetalhesFeiraScreen';

import FeiranteDrawer from './src/navigation/FeiranteDrawer';
import AdminDrawer from './src/navigation/AdminDrawer';
import VerQrCodeScreen from './src/screens/feirante/VerQrCodeScreen';
import VerBancaScreen from './src/screens/feirante/MinhaBancaScreen';
import ConfirmarCheckinScreen from './src/screens/admin/ConfirmarCheckinScreen';
import SolicitarSubstitutoScreen from './src/screens/feirante/SolicitarSubstitutoScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    iniciarWebSocketComNotificacoes();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          {/* Tela inicial que decide o fluxo */}
          <Stack.Screen name="Splash" component={SplashScreen} />

          {/* Acesso geral */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroFeiranteScreen} />

          {/* Feirante */}
          <Stack.Screen name="FeiranteDrawer" component={FeiranteDrawer} />
          <Stack.Screen name="Solicitar-Substituto" component={SolicitarSubstitutoScreen} />
          <Stack.Screen name="VerQrCode" component={VerQrCodeScreen} />
          <Stack.Screen name="VerMinhaBanca" component={VerBancaScreen} />

          {/* Admin */}
          <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
          <Stack.Screen name="VerDetalhesFeirante" component={VerDetalhesFeiranteScreen} />
          <Stack.Screen name="VerDetalhesFeira" component={VerDetalhesFeiraScreen} />
          <Stack.Screen name="CadastrarFeira" component={CadastrarFeiraScreen} />
          <Stack.Screen name="AtualizarFeira" component={AtualizarFeiraScreen} />
          <Stack.Screen name="ConfirmarCheckin" component={ConfirmarCheckinScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage position="top" />
    </>
  );
}

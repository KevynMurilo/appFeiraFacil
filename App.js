import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import FlashMessage from 'react-native-flash-message';
import * as SplashScreen from 'expo-splash-screen';

import { iniciarWebSocketComNotificacoes } from './src/config/websocketNotificacao';

// Telas
import CheckConnectionScreen from './src/screens/gereric/CheckConnectionScreen';
import SplashScreenApp from './src/screens/gereric/SplashScreen';
import LoginScreen from './src/screens/gereric/LoginScreen';
import CadastroFeiranteScreen from './src/screens/feirante/CadastroFeiranteScreen';
import VerDetalhesFeiranteScreen from './src/screens/admin/VerDetalhesFeiranteScreen';
import CadastrarFeiraScreen from './src/screens/admin/CadastrarFeiraScreen';
import AtualizarFeiraScreen from './src/screens/admin/AtualizarFeiraScreen';
import FeiranteDrawer from './src/navigation/FeiranteDrawer';
import AdminDrawer from './src/navigation/AdminDrawer';
import VerQrCodeScreen from './src/screens/feirante/VerQrCodeScreen';
import VerBancaScreen from './src/screens/feirante/MinhaBancaScreen';
import ConfirmarCheckinScreen from './src/screens/admin/ConfirmarCheckinScreen';
import SolicitarSubstitutoScreen from './src/screens/feirante/SolicitarSubstitutoScreen';
import VisualizarFilaEsperaScreen from './src/screens/admin/VisualizarFilaEsperaScreen';
import FeirantesComTresFaltasScreen from './src/screens/admin/FeirantesComTresFaltasScreen';
import VerJustificativasFeiranteScreen from './src/screens/admin/VerJustificativasFeiranteScreen';
import SubstituirFeiranteScreen from './src/screens/admin/SubstituirFeiranteScreen';
import VerDetalhesFeiraScreen from './src/screens/gereric/VerDetalhesFeiraScreen';
import CadastrarBancaScreen from './src/screens/feirante/CadastroBancaScreen';
import JustificarFaltaScreen from './src/screens/feirante/JustificarFaltaScreen';
import VerFaltasScreen from './src/screens/feirante/VerFaltasScreen';
import EditarPerfilScreen from './src/screens/feirante/EditarPerfilScreen';
import AtualizarBancaScreen from './src/screens/feirante/AtualizarBancaScreen';
import VerDetalhesByIdFeiranteAndBancaScreen from './src/screens/admin/VerDetalhesByIdFeiranteAndBancaScreen';

const Stack = createStackNavigator();

// Impede splash da Expo de esconder automaticamente
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    iniciarWebSocketComNotificacoes();

    // Oculta splash da Expo assim que o app monta
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="VerificarConexao"
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name="VerificarConexao" component={CheckConnectionScreen} />
          <Stack.Screen name="Splash" component={SplashScreenApp} />

          {/* Acesso geral */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroFeiranteScreen} />

          {/* Feirante */}
          <Stack.Screen name="FeiranteDrawer" component={FeiranteDrawer} />
          <Stack.Screen name="Solicitar-Substituto" component={SolicitarSubstitutoScreen} />
          <Stack.Screen name="CadastrarBanca" component={CadastrarBancaScreen} />
          <Stack.Screen name="EditarBanca" component={AtualizarBancaScreen} />
          <Stack.Screen name="VerQrCode" component={VerQrCodeScreen} />
          <Stack.Screen name="VerMinhaBanca" component={VerBancaScreen} />
          <Stack.Screen name="JustificarFalta" component={JustificarFaltaScreen} />
          <Stack.Screen name="VerFaltas" component={VerFaltasScreen} />
          <Stack.Screen name="Perfil" component={EditarPerfilScreen} />

          {/* Admin */}
          <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
          <Stack.Screen name="VerDetalhesFeirante" component={VerDetalhesFeiranteScreen} />
          <Stack.Screen name="VerDetalhesByIdFeiranteAndBanca" component={VerDetalhesByIdFeiranteAndBancaScreen} />
          <Stack.Screen name="VerDetalhesFeira" component={VerDetalhesFeiraScreen} />
          <Stack.Screen name="CadastrarFeira" component={CadastrarFeiraScreen} />
          <Stack.Screen name="AtualizarFeira" component={AtualizarFeiraScreen} />
          <Stack.Screen name="ConfirmarCheckin" component={ConfirmarCheckinScreen} />
          <Stack.Screen name="VisualizarFilaEspera" component={VisualizarFilaEsperaScreen} />
          <Stack.Screen name="FeirantesComTresFaltas" component={FeirantesComTresFaltasScreen} />
          <Stack.Screen name="VerJustificativasFeirante" component={VerJustificativasFeiranteScreen} />
          <Stack.Screen name="SubstituirFeirante" component={SubstituirFeiranteScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <FlashMessage position="top" />
    </>
  );
}

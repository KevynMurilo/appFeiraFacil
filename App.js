import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/feirante/CadastroScreen';
import HomeAdminScreen from './src/screens/admin/HomeAdminScreen';
import GerenciarFeirantesScreen from './src/screens/admin/GerenciarFeirantesScreen';
import VerDetalhesFeiranteScreen from './src/screens/admin/VerDetalhesFeiranteScreen';
import GerenciarFeirasScreen from './src/screens/admin/GerenciarFeirasScreen';
import CadastrarFeiraScreen from './src/screens/admin/CadastrarFeiraScreen';
import AtualizarFeiraScreen from './src/screens/admin/AtualizarFeiraScreen';
import LerQrCodeChamadaScreen from './src/screens/admin/LerQrCodeChamadaScreen';
import VerDetalhesFeiraScreen from './src/screens/admin/VerDetalhesFeiraScreen';

import FeiranteDrawer from './src/navigation/FeiranteDrawer';
import AdminDrawer from './src/navigation/AdminDrawer';

import CadastrarSubstitutoScreen from './src/screens/feirante/CadastrarSubstitutoScreen';
import VerQrCodeScreen from './src/screens/feirante/VerQrCodeScreen';
import VerBancaScreen from './src/screens/feirante/MinhaBancaScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS
        }}
      >
        {/* Acesso geral */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />

        {/* Feirante Drawer */}
        <Stack.Screen name="FeiranteDrawer" component={FeiranteDrawer} />
        <Stack.Screen name="CadastrarSubstituto" component={CadastrarSubstitutoScreen} />
        <Stack.Screen name="VerQrCode" component={VerQrCodeScreen} />
        <Stack.Screen name="VerMinhaBanca" component={VerBancaScreen} />

        {/* Admin Drawer */}
        <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
        <Stack.Screen name="VerDetalhesFeirante" component={VerDetalhesFeiranteScreen} />
        <Stack.Screen name="VerDetalhesFeira" component={VerDetalhesFeiraScreen} />
        <Stack.Screen name="CadastrarFeira" component={CadastrarFeiraScreen} />
        <Stack.Screen name="AtualizarFeira" component={AtualizarFeiraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import CadastroFeiranteScreen from './src/screens/feirante/CadastroFeiranteScreen';
import VerDetalhesFeiranteScreen from './src/screens/admin/VerDetalhesFeiranteScreen';
import CadastrarFeiraScreen from './src/screens/admin/CadastrarFeiraScreen';
import AtualizarFeiraScreen from './src/screens/admin/AtualizarFeiraScreen';
import VerDetalhesFeiraScreen from './src/screens/admin/VerDetalhesFeiraScreen';

import FeiranteDrawer from './src/navigation/FeiranteDrawer';
import AdminDrawer from './src/navigation/AdminDrawer';

import CadastrarSubstitutoScreen from './src/screens/feirante/CadastrarSubstitutoScreen';
import VerQrCodeScreen from './src/screens/feirante/VerQrCodeScreen';
import VerBancaScreen from './src/screens/feirante/MinhaBancaScreen';
import ConfirmarCheckinScreen from './src/screens/admin/ConfirmarCheckinScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AdminDrawer"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS
        }}
      >
        {/* Acesso geral */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroFeiranteScreen} />

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
        <Stack.Screen name="ConfirmarCheckin" component={ConfirmarCheckinScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

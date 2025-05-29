import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/feirante/CadastroScreen';
import HomeFeiranteScreen from './src/screens/feirante/HomeFeiranteScreen';
import CadastroBancaScreen from './src/screens/feirante/CadastroBancaScreen';
import GerenciarSubstitutosScreen from './src/screens/feirante/GerenciarSubstitutosScreen';
import CadastrarSubstitutoScreen from './src/screens/feirante/CadastrarSubstitutoScreen';
import VerQrCodeScreen from './src/screens/feirante/VerQrCodeScreen';
import VerBancaScreen from './src/screens/feirante/MinhaBancaScreen';
import HomeAdminScreen from './src/screens/admin/HomeAdminScreen';
import GerenciarFeirantesScreen from './src/screens/admin/GerenciarFeirantesScreen';
import VerDetalhesFeiranteScreen from './src/screens/admin/VerDetalhesFeiranteScreen';
import GerenciarFeirasScreen from './src/screens/admin/GerenciarFeirasScreen';
import CadastrarFeiraScreen from './src/screens/admin/CadastrarFeiraScreen';
import AtualizarFeiraScreen from './src/screens/admin/AtualizarFeiraScreen';
import LerQrCodeChamadaScreen from './src/screens/admin/LerQrCodeChamadaScreen';
import VerDetalhesFeiraScreen from './src/screens/admin/VerDetalhesFeiraScreen';
import FeirasRegistradasScreen from './src/screens/feirante/FeirasRegistradasScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeAdmin"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="HomeFeirante" component={HomeFeiranteScreen} />
        <Stack.Screen name="FeirasRegistradas" component={FeirasRegistradasScreen} />
        <Stack.Screen name="CadastrarBanca" component={CadastroBancaScreen} />
        <Stack.Screen name="VerMinhaBanca" component={VerBancaScreen} />
        <Stack.Screen name="GerenciarSubstituto" component={GerenciarSubstitutosScreen} />
        <Stack.Screen name="CadastrarSubstituto" component={CadastrarSubstitutoScreen} />
        <Stack.Screen name="VerQrCode" component={VerQrCodeScreen} />

        <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
        <Stack.Screen name="GerenciarFeirantes" component={GerenciarFeirantesScreen} />
        <Stack.Screen name="VerDetalhesFeirante" component={VerDetalhesFeiranteScreen} />
        <Stack.Screen name="GerenciarFeiras" component={GerenciarFeirasScreen} />
        <Stack.Screen name="VerDetalhesFeira" component={VerDetalhesFeiraScreen} />
        <Stack.Screen name="CadastrarFeira" component={CadastrarFeiraScreen} />
        <Stack.Screen name="AtualizarFeira" component={AtualizarFeiraScreen} />
        <Stack.Screen name="LerQrCodeChamada" component={LerQrCodeChamadaScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

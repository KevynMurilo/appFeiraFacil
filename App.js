import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeFeiranteScreen from './src/screens/HomeFeiranteScreen';
import CadastroBancaScreen from './src/screens/CadastroBancaScreen';
import GerenciarSubstitutosScreen from './src/screens/GerenciarSubstitutosScreen';
import CadastrarSubstitutoScreen from './src/screens/CadastrarSubstitutoScreen';
import VerQrCodeScreen from './src/screens/VerQrCodeScreen';
import VerBancaScreen from './src/screens/MinhaBancaScreen';

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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="HomeFeirante" component={HomeFeiranteScreen} />
        <Stack.Screen name="CadastrarBanca" component={CadastroBancaScreen} />
        <Stack.Screen name="VerMinhaBanca" component={VerBancaScreen} />
        <Stack.Screen name="GerenciarSubstituto" component={GerenciarSubstitutosScreen} />
        <Stack.Screen name="CadastrarSubstituto" component={CadastrarSubstitutoScreen} />
        <Stack.Screen name="VerQrCode" component={VerQrCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

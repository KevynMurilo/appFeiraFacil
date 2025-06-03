import { createDrawerNavigator } from '@react-navigation/drawer';
import GerenciarBancasScreen from '../screens/feirante/GerenciarBancasScreen';
import GerenciarSubstitutosScreen from '../screens/feirante/GerenciarSubstitutosScreen';
import DrawerVisual, { drawerScreenOptions } from '../components/DrawerVisual';
import SolicitacoesSubstitutoScreen from '../screens/feirante/SolicitacoesSubstitutoScreen';
import GerenciarFeirasScreen from '../screens/gereric/GerenciarFeirasScreen';

const Drawer = createDrawerNavigator();

export default function FeiranteDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Gerenciar Feiras"
      drawerContent={(props) => <DrawerVisual {...props} />}
      screenOptions={drawerScreenOptions}
    >
      <Drawer.Screen name="Gerenciar Feiras" component={GerenciarFeirasScreen} />
      <Drawer.Screen name="Gerenciar Bancas" component={GerenciarBancasScreen} />
      <Drawer.Screen name="Gerenciar Substitutos" component={GerenciarSubstitutosScreen} />
      <Drawer.Screen name="Solicitações Recebidas" component={SolicitacoesSubstitutoScreen} />

    </Drawer.Navigator>
  );
}

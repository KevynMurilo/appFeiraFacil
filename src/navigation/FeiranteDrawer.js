import { createDrawerNavigator } from '@react-navigation/drawer';
import FeirasRegistradasScreen from '../screens/feirante/FeirasRegistradasScreen';
import GerenciarSubstitutosScreen from '../screens/feirante/GerenciarSubstitutosScreen';
import CadastrarBancaScreen from '../screens/feirante/CadastroBancaScreen';
import DrawerVisual, { drawerScreenOptions } from '../components/DrawerVisual';

const Drawer = createDrawerNavigator();

export default function FeiranteDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Feiras Registradas"
      drawerContent={(props) => <DrawerVisual {...props} />}
      screenOptions={drawerScreenOptions}
    >
      <Drawer.Screen name="Feiras Registradas" component={FeirasRegistradasScreen} />
      <Drawer.Screen name="Cadastrar Banca" component={CadastrarBancaScreen} />
      <Drawer.Screen name="Gerenciar Substitutos" component={GerenciarSubstitutosScreen} />
    </Drawer.Navigator>
  );
}

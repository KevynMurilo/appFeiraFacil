import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeAdminScreen from '../screens/admin/HomeAdminScreen';
import GerenciarFeirantesScreen from '../screens/admin/GerenciarFeirantesScreen';
import LerQrCodeChamadaScreen from '../screens/admin/LerQrCodeChamadaScreen';
import DrawerVisual, { drawerScreenOptions } from '../components/DrawerVisual';
import FilaDeEsperaScreen from '../screens/admin/FilaDeEsperaScreen';
import SelecionarFeiraFaltasScreen from '../screens/admin/SelecionarFeiraFaltasScreen';
import GerenciarFeirasScreen from '../screens/gereric/GerenciarFeirasScreen';

const Drawer = createDrawerNavigator();

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="GerenciarFeirantes"
      drawerContent={(props) => <DrawerVisual {...props} />}
      screenOptions={drawerScreenOptions}
    >
      <Drawer.Screen name="GerenciarFeirantes" component={GerenciarFeirantesScreen} options={{ title: 'Gerenciar Feirantes' }} />
      <Drawer.Screen name="GerenciarFeiras" component={GerenciarFeirasScreen} options={{ title: 'Gerenciar Feiras' }} />
      <Drawer.Screen name="VerFilaEspera" component={FilaDeEsperaScreen} options={{ title: 'Fila de Espera' }} />
      <Drawer.Screen name="SelecionarFeirasFalta" component={SelecionarFeiraFaltasScreen} options={{ title: 'Feirante com Faltas' }} />
      <Drawer.Screen name="LerQrCodeChamada" component={LerQrCodeChamadaScreen} options={{ title: 'Fazer Chamada' }} />
    </Drawer.Navigator>
  );
}

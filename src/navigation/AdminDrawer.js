import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeAdminScreen from '../screens/admin/HomeAdminScreen';
import GerenciarFeirantesScreen from '../screens/admin/GerenciarFeirantesScreen';
import GerenciarFeirasScreen from '../screens/admin/GerenciarFeirasScreen';
import LerQrCodeChamadaScreen from '../screens/admin/LerQrCodeChamadaScreen';
import DrawerVisual, { drawerScreenOptions } from '../components/DrawerVisual';

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
      <Drawer.Screen name="LerQrCodeChamada" component={LerQrCodeChamadaScreen} options={{ title: 'Fazer Chamada' }} />
    </Drawer.Navigator>
  );
}

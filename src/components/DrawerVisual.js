import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function DrawerVisual(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              'token',
              'tipoUsuario',
              'usuarioId',
              'usuarioNome',
              'dataHoraLogin',
            ]);
          } catch (error) {
            console.error('Erro ao limpar AsyncStorage:', error);
          }

          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>⎋ Sair</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export const drawerScreenOptions = {
  drawerActiveTintColor: '#004AAD',
  drawerInactiveTintColor: '#444',
  drawerActiveBackgroundColor: '#E1ECFF',
  drawerLabelStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
  drawerItemStyle: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  drawerStyle: {
    backgroundColor: '#F2F6FF',
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#004AAD',
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

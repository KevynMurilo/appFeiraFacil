import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerVisual(props) {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        const nomeSalvo = await AsyncStorage.getItem('usuarioNome');
        const emailSalvo = await AsyncStorage.getItem('usuarioEmail');
        setNome(nomeSalvo || 'Usuário');
        setEmail(emailSalvo || 'email@exemplo.com');
      };
      carregarDados();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove([
            'token',
            'tipoUsuario',
            'usuarioId',
            'usuarioNome',
            'usuarioEmail',
            'dataHoraLogin',
          ]);
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      {/* Cabeçalho com perfil */}
      <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Perfil')}>
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={32} color="#fff" />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#fff" style={styles.profileArrow} />
      </TouchableOpacity>

      {/* Itens do Drawer */}
      <DrawerItemList {...props} />

      {/* Botão de sair */}
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
  },
  drawerStyle: {
    backgroundColor: '#F2F6FF',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004AAD',
    padding: 16,
    marginBottom: 10,
    borderBottomWidth: 4,
    borderColor: '#00AEEF',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00AEEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    color: '#cce6ff',
    fontSize: 13,
  },
  profileArrow: {
    marginLeft: 'auto',
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

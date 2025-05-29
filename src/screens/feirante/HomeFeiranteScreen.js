import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BotaoSair from '../../components/BotaoSair';

export default function HomeFeiranteScreen() {
  const navigation = useNavigation();

  const substitutoAtivo = {
    nomeTitular: 'Maria das Feiras',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BotaoSair />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Olá, Feirante 👋</Text>
        <Text style={styles.subtitulo}>Bem-vindo ao FeiraFácil. Abaixo estão suas opções:</Text>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('FeirasRegistradas')}>
          <Text style={styles.botaoTexto}>Ver Feiras Registradas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('CadastrarBanca')}>
          <Text style={styles.botaoTexto}>Cadastrar Banca</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('GerenciarSubstituto')}>
          <Text style={styles.botaoTexto}>Gerenciar Substitutos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('JustificarFalta')}>
          <Text style={styles.botaoTexto}>Justificar Ausência</Text>
        </TouchableOpacity>

        {substitutoAtivo && (
          <View style={styles.alertaCard}>
            <Text style={styles.alertaTexto}>
              Você está ativo como substituto de{' '}
              <Text style={{ fontWeight: 'bold' }}>{substitutoAtivo.nomeTitular}</Text>.
            </Text>
            <Text style={styles.alertaTexto}>Um e-mail foi enviado com os detalhes da substituição.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 25,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertaCard: {
    backgroundColor: '#FFFAE6',
    borderLeftWidth: 6,
    borderLeftColor: '#FFD700',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
  alertaTexto: {
    color: '#665c00',
    marginBottom: 5,
  },
});

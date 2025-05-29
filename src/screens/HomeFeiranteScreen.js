import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeFeiranteScreen() {
  const navigation = useNavigation();

  const feiras = [
    { id: 1, nome: 'Feira do Centro', status: 'ATIVO', posicaoFila: null },
    { id: 2, nome: 'Feira do Bairro Novo', status: 'EM_FILA', posicaoFila: 3 },
  ];

  const substitutoAtivo = {
    nomeTitular: 'Maria das Feiras',
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: () => navigation.replace('Login'),
        style: 'destructive',
      },
    ]);
  };

  const renderFeira = (feira) => (
    <View key={feira.id} style={styles.card}>
      <Text style={styles.nomeFeira}>{feira.nome}</Text>
      <Text style={styles.status}>
        Status:{' '}
        <Text style={{ fontWeight: 'bold', color: feira.status === 'ATIVO' ? 'green' : '#f90' }}>
          {feira.status}
        </Text>
      </Text>
      {feira.status === 'EM_FILA' && (
        <Text style={styles.fila}>Fila de espera: {feira.posicaoFila}</Text>
      )}

      <TouchableOpacity
        style={styles.botaoInterno}
        onPress={() =>
          navigation.navigate('VerMinhaBanca', {
            banca: {
              tipoProduto: 'Verduras e Legumes',
              produtos: ['Alface', 'Cenoura', 'Couve'],
              feira: { nome: feira.nome },
              qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=Banca-' + feira.id,
            },
          })
        }
      >
        <Text style={styles.botaoInternoTexto}>Ver Minha Banca</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Botão de Sair */}
      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
        <Text style={styles.sairTexto}>⎋ Sair</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Olá, Feirante 👋</Text>
        <Text style={styles.subtitulo}>Estas são suas feiras registradas:</Text>

        {feiras.map(renderFeira)}

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
  botaoSair: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#f33',
    borderRadius: 6,
  },
  sairTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    elevation: 2,
  },
  nomeFeira: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 4,
  },
  status: {
    fontSize: 15,
    marginBottom: 4,
  },
  fila: {
    fontSize: 14,
    marginBottom: 8,
    color: '#f90',
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
  botaoInterno: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  botaoInternoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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

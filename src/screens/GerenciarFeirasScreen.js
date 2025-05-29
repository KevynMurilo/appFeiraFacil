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
import { Ionicons } from '@expo/vector-icons';

export default function GerenciarFeirasScreen() {
  const navigation = useNavigation();

  const feiras = [
    {
      id: '1',
      nome: 'Feira do Centro',
      local: 'Praça Central',
      diasSemana: 'Segunda, Quarta e Sexta',
      horario: '07:00',
      maxFeirantes: 30,
      feirantes: [{}, {}, {}, {}],
      latitude: '-15.542696',
      longitude: '-47.337357',
    },
    {
      id: '2',
      nome: 'Feira da Vila',
      local: 'Avenida Brasil',
      diasSemana: 'Terça e Quinta',
      horario: '08:00',
      maxFeirantes: 20,
      feirantes: [{}, {}, {}],
      latitude: '-15.558135',
      longitude: '-47.335229',
    },
  ];

  const renderFeira = (feira) => {
    const vagas = feira.maxFeirantes - feira.feirantes.length;

    return (
      <View key={feira.id} style={styles.card}>
        <Text style={styles.nome}>{feira.nome}</Text>
        <Text style={styles.info}><Text style={styles.label}>Local:</Text> {feira.local}</Text>
        <Text style={styles.info}><Text style={styles.label}>Dias:</Text> {feira.diasSemana}</Text>
        <Text style={styles.info}><Text style={styles.label}>Horário:</Text> {feira.horario}h</Text>
        <Text style={styles.info}><Text style={styles.label}>Vagas:</Text> {feira.feirantes.length}/{feira.maxFeirantes} ocupadas</Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('VerDetalhesFeira', { feira })}
        >
          <Text style={styles.botaoTexto}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#004AAD" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButtonNova}
          onPress={() => navigation.navigate('CadastrarFeira')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#00AEEF" />
          <Text style={styles.headerButtonText}>Nova Feira</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Gerenciar Feiras</Text>
        <Text style={styles.subtitulo}>Lista de feiras cadastradas</Text>

        {feiras.map(renderFeira)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: 5,
  },
  headerButtonNova: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  headerButtonText: {
    marginLeft: 6,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    paddingTop: 10,
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
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F2F6FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#004AAD',
  },
  botao: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

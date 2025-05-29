import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CadastrarBancaScreen() {
  const navigation = useNavigation();

  const [tipoProduto, setTipoProduto] = useState('');
  const [produtoAtual, setProdutoAtual] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [feiraSelecionada, setFeiraSelecionada] = useState('');

  // Mock de feiras disponíveis
  const feirasDisponiveis = [
    { id: '1', nome: 'Feira do Centro' },
    { id: '2', nome: 'Feira da Vila' },
  ];

  const adicionarProduto = () => {
    if (produtoAtual.trim() !== '') {
      setProdutos([...produtos, produtoAtual.trim()]);
      setProdutoAtual('');
    }
  };

  const handleCadastrar = () => {
    const bancaMock = {
      tipoProduto,
      produtos,
      feiraId: feiraSelecionada,
      feiranteId: 'mock-id-do-feirante-logado',
    };
    console.log('Banca cadastrada:', bancaMock);
    alert('Banca cadastrada com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="#004AAD" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Cadastrar Banca</Text>

      <Text style={styles.label}>Selecione a feira</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={feiraSelecionada}
          onValueChange={(itemValue) => setFeiraSelecionada(itemValue)}
        >
          <Picker.Item label="Selecione uma feira" value="" />
          {feirasDisponiveis.map((feira) => (
            <Picker.Item key={feira.id} label={feira.nome} value={feira.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Hortaliças"
        value={tipoProduto}
        onChangeText={setTipoProduto}
      />

      <Text style={styles.label}>Adicionar Produto</Text>
      <View style={styles.linhaProduto}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Ex: Alface"
          value={produtoAtual}
          onChangeText={setProdutoAtual}
        />
        <TouchableOpacity onPress={adicionarProduto} style={styles.botaoAdd}>
          <Ionicons name="add-circle" size={28} color="#00AEEF" />
        </TouchableOpacity>
      </View>

      {produtos.length > 0 && (
        <View style={styles.listaProdutos}>
          <Text style={styles.label}>Produtos Adicionados:</Text>
          {produtos.map((p, idx) => (
            <Text key={idx} style={styles.produtoItem}>
              • {p}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  voltar: {
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004AAD',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  linhaProduto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botaoAdd: {
    padding: 4,
  },
  listaProdutos: {
    marginTop: 10,
    marginBottom: 10,
  },
  produtoItem: {
    fontSize: 15,
    marginLeft: 8,
    marginBottom: 4,
    color: '#555',
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

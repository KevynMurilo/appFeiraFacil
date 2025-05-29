import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
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
    <SafeAreaView style={styles.safe}>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>📍 Selecione a feira</Text>
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

        <Text style={styles.label}>🧺 Tipo de Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Hortaliças"
          value={tipoProduto}
          onChangeText={setTipoProduto}
        />

        <Text style={styles.label}>📦 Adicionar Produto</Text>
        <View style={styles.linhaProduto}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Ex: Alface"
            value={produtoAtual}
            onChangeText={setProdutoAtual}
          />
          <TouchableOpacity onPress={adicionarProduto} style={styles.botaoAdd}>
            <Ionicons name="add-circle" size={30} color="#00AEEF" />
          </TouchableOpacity>
        </View>

        {produtos.length > 0 && (
          <View style={styles.listaProdutos}>
            <Text style={styles.label}>✅ Produtos Adicionados</Text>
            <View style={styles.cardProdutos}>
              {produtos.map((p, idx) => (
                <Text key={idx} style={styles.produtoItem}>
                  • {p}
                </Text>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.botao} onPress={handleCadastrar}>
          <Text style={styles.botaoTexto}>Cadastrar Banca</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 12,
    color: '#004AAD',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
  },
  linhaProduto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  botaoAdd: {
    padding: 4,
  },
  listaProdutos: {
    marginTop: 10,
    marginBottom: 20,
  },
  cardProdutos: {
    backgroundColor: '#F2F6FF',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  produtoItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  botao: {
    backgroundColor: '#004AAD',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

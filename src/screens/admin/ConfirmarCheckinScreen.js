import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopoNavegacao from '../../components/TopoNavegacao';
import { API_URL } from '../../config/api';

export default function ConfirmarCheckinScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { qrCode } = route.params;

  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_URL}/bancas/qr/${qrCode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setDados(res.data.data);
        } else {
          Alert.alert('Erro', res.data.message);
          navigation.goBack();
        }
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível buscar os dados da banca');
        console.error(err);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [qrCode]);

  const handleConfirmar = async () => {
    if (!dados?.bancaId || !dados?.feiranteId) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/checkins`,
        null,
        {
          params: {
            idBanca: dados.bancaId,
            idFeirante: dados.feiranteId,
            qrCode: qrCode,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultado = response.data;

      if (resultado.success) {
        Alert.alert('✅ Sucesso', resultado.message || 'Check-in confirmado com sucesso');
        navigation.goBack();
      } else {
        Alert.alert('❌ Erro', resultado.message || 'Não foi possível registrar o check-in.');
      }
    } catch (error) {
      console.error('❗ Erro no check-in:', error);
      const mensagemErro = error.response?.data?.message || 'Erro inesperado ao registrar o check-in.';
      Alert.alert('Erro', mensagemErro);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopoNavegacao titulo="Confirmar Check-in" />
        <ActivityIndicator size="large" color="#004AAD" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopoNavegacao titulo="Confirmar Check-in" />
      <ScrollView contentContainerStyle={styles.container}>
        <HorarioResumo dia={dados?.dia} inicio={dados?.horarioInicio} fim={dados?.horarioFim} />

        <InfoCard icon={<Ionicons name="person-circle-outline" size={24} color="#004AAD" />} title="Feirante">
          <Item label="Nome" valor={dados?.nomeFeirante} />
          <Item label="CPF" valor={dados?.cpf} />
          <Item label="Telefone" valor={dados?.telefone} isLink tipo="telefone" />
          <Item label="E-mail" valor={dados?.email} isLink tipo="email" />
        </InfoCard>

        <InfoCard icon={<MaterialCommunityIcons name="storefront-outline" size={22} color="#004AAD" />} title="Banca">
          <Item label="Feira" valor={dados?.nomeFeira} />
          <Item label="Tipo de Produto" valor={dados?.tipoProduto} />
          <Text style={styles.label}>Produtos</Text>
          <View style={styles.listaProdutos}>
            {dados?.produtos?.map((prod, index) => (
              <View key={index} style={styles.produtoBadge}>
                <Text style={styles.produtoTexto}>{prod}</Text>
              </View>
            ))}
          </View>
        </InfoCard>

        <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
          <Text style={styles.botaoTexto}>Confirmar Presença</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const HorarioResumo = ({ dia, inicio, fim }) => (
  <View style={styles.horarioResumoContainer}>
    <Ionicons name="calendar-outline" size={18} color="#004AAD" style={{ marginRight: 6 }} />
    <Text style={styles.horarioResumoTexto}>
      {dia || '---'} • {inicio || '--:--'} às {fim || '--:--'}
    </Text>
  </View>
);

const InfoCard = ({ icon, title, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      {icon}
      <Text style={styles.cardTitulo}>{title}</Text>
    </View>
    {children}
  </View>
);

const Item = ({ label, valor, isLink, tipo }) => {
  const handlePress = () => {
    if (!isLink) return;
    if (tipo === 'telefone') Linking.openURL(`tel:${valor}`);
    if (tipo === 'email') Linking.openURL(`mailto:${valor}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={!isLink} activeOpacity={0.7}>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.linkContainer}>
          <Text
            style={[
              styles.valor,
              isLink && styles.linkTexto,
            ]}
          >
            {valor || '---'}
          </Text>
          {isLink && (
            <Ionicons
              name={tipo === 'telefone' ? 'call-outline' : 'mail-outline'}
              size={16}
              color="#004AAD"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 30, flexGrow: 1 },
  horarioResumoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#E6F0FF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
  },
  horarioResumoTexto: {
    fontSize: 16,
    color: '#004AAD',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#F2F6FF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: '#004AAD',
  },
  valor: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  linkTexto: {
    color: '#004AAD',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  listaProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  produtoBadge: {
    backgroundColor: '#00AEEF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  produtoTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoConfirmar: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: '#00AEEF',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
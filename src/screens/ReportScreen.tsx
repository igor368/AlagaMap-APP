import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NewReportScreen({ navigation }: any) {
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [street, setStreet] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setLocation({ latitude, longitude });

      try {
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (address.length > 0 && address[0].street) {
          setStreet(address[0].street);
        }
      } catch (err) {
        console.log('Erro ao obter nome da rua:', err);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Erro', 'Localização não disponível');
      return;
    }

    try {
      await api.post(
        '/reports',
        {
          latitude: location.latitude,
          longitude: location.longitude,
          comment,
          street,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Sucesso', 'Alagamento reportado!');
      navigation.goBack();
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível enviar o relatório');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Alagamento</Text>
      <Text>Localização: {location ? `${location.latitude}, ${location.longitude}` : 'Buscando...'}</Text>
      <Text>Rua: {street || 'Buscando nome da rua...'}</Text>
      <TextInput
        placeholder="Comentário (opcional)"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      <Button title="Enviar Alagamento" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 16,
    borderRadius: 5,
  },
});

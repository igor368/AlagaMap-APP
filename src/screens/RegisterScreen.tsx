import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api'; 


export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', {
        email,
        password,
      });
      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      //const message = error?.response?.data?.message || 'Erro ao registrar';

      let message = 'Erro ao registrar';
      const errData = error?.response?.data;

      if (errData?.message) {
        message = Array.isArray(errData.message)
          ? errData.message.join('\n') // junta mensagens se for array
          : errData.message;
      }


      Alert.alert('Erro', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Cadastrar" onPress={handleRegister} />
      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Já tem conta? Faça login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'blue',
  },
});

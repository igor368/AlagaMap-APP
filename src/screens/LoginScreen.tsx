import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext'; // importa o contexto

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // usa a função de login do contexto

  const handleLogin = async () => {
    try {
      await login(email, password); // login com o contexto
      navigation.navigate('Map'); // vai para a tela do mapa
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Erro', 'Email ou senha inválidos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text> 

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />

      {/* <View style={{ marginTop: 20 }}>
        <Button title="Não tem conta? Cadastre-se" onPress={() => navigation.navigate('Register')} />
      </View> */}

      <Text style={styles.loginText} onPress={() => navigation.navigate('Register')}>
        Não tem conta? Cadastre-se
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  loginText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'blue',
  },
});

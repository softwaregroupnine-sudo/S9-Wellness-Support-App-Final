
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { loginUser } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(email, password);

      // Keep the authenticated user's details for the next step.
      navigation.replace('MainApp', { user });
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wellness Support</Text>

      <Text style={styles.subtitle}>Welcome back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <View style={styles.space} />

      <Button
        title="Register"
        disabled={loading}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },

  space: {
    height: 10,
  },
});

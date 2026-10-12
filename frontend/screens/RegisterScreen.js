
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

import { registerUser } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      Alert.alert('Missing details', 'Please complete all fields.');
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        'Password too short',
        'Your password must contain at least 8 characters.'
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(displayName, email, password);

      Alert.alert(
        'Account created',
        'Your account has been registered successfully.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Registration failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Register for Wellness Support
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        editable={!loading}
      />

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
        <Button
          title="Register"
          onPress={handleRegister}
        />
      )}
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
});

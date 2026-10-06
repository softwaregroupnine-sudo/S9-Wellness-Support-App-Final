import React from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';


export default function LoginScreen({ navigation }) {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Wellness Support
      </Text>

      <Text style={styles.subtitle}>
        Welcome back
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />

      <Button
        title="Login"
        onPress={() => navigation.replace('MainApp')}
      />

      <View style={styles.space} />

      <Button
        title="Register"
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
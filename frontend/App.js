import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function LoginScreen() {
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
        onPress={() => alert('Login pressed')}
      />

      <View style={styles.space} />

      <Button
        title="Register"
        onPress={() => alert('Register pressed')}
      />

    </View>
  );
}

function HomeScreen() {
  return null;
}

function AssessmentScreen() {
  return null;
}

function ResultScreen() {
  return null;
}

function HistoryScreen() {
  return null;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Assessment"
          component={AssessmentScreen}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
        />

        <Stack.Screen
          name="History"
          component={HistoryScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
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
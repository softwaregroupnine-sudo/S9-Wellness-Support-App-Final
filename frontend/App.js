import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import MoodCheckinScreen from './screens/MoodCheckinScreen';
import AIAnalysisScreen from './screens/AIAnalysisScreen';
import GuidanceScreen from './screens/GuidanceScreen';
import SettingsScreen from './screens/SettingsScreen';
import BreathingExerciseScreen from './screens/BreathingExerciseScreen';
import FocusTimerScreen from './screens/FocusTimerScreen';
import GratitudeJournalScreen from './screens/GratitudeJournalScreen';
import AIChatScreen from './screens/AIChatScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainApp() {
  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Check-in"
        component={MoodCheckinScreen}
      />

      <Tab.Screen
        name="AI Analysis"
        component={AIAnalysisScreen}
      />

      <Tab.Screen
        name="Guidance"
        component={GuidanceScreen}
      />

      <Tab.Screen
        name="More"
        component={SettingsScreen}
      />

    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BreathingExercise"
          component={BreathingExerciseScreen}
          options={{
            title: 'Breathing Exercise',
          }}
        />

        <Stack.Screen
          name="FocusTimer"
          component={FocusTimerScreen}
         options={{
        title: 'Focus Timer',
  }}
/>

    <Stack.Screen
    name="GratitudeJournal"
    component={GratitudeJournalScreen}
    options={{
    title: 'Gratitude Journal',
  }}
/>

<Stack.Screen
  name="AIChat"
  component={AIChatScreen}
  options={{
    headerShown: false,
  }}
/>

      </Stack.Navigator>

    </NavigationContainer>
  );
}
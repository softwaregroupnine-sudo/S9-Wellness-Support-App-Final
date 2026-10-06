import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function AIChatScreen({ navigation }) {
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.sparkle}>✦</Text>
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.historyButton}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.chat}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContent}
      >

        <View style={styles.welcomeContainer}>
          <View style={styles.aiCircle}>
            <Text style={styles.robot}>🤖</Text>
          </View>

          <Text style={styles.welcomeTitle}>
            Hi! I'm here to help.
          </Text>

          <Text style={styles.welcomeText}>
            You can ask me about your wellbeing, mood, or things you're
            experiencing.
          </Text>
        </View>

        <View style={styles.userMessage}>
          <Text style={styles.userMessageText}>
            Why have I been feeling tired lately?
          </Text>
        </View>

        <View style={styles.aiMessage}>
          <Text style={styles.aiMessageText}>
            Feeling tired can happen for many reasons. Your recent check-ins
            may help identify patterns such as sleep, stress, or daily habits.
          </Text>
        </View>

      </ScrollView>

      <View style={styles.inputArea}>

        <View style={styles.inputContainer}>
          <Text style={styles.inputSparkle}>✦</Text>

          <TextInput
            style={styles.input}
            placeholder="Ask something..."
            placeholderTextColor="#8C8490"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDD5D6',
  },

  header: {
    height: 85,
    paddingHorizontal: 18,
    paddingTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DDD5D6',
  },

  backButton: {
    fontSize: 38,
    color: '#4D315C',
    lineHeight: 38,
  },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sparkle: {
    fontSize: 20,
    color: '#654571',
    marginRight: 6,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4D315C',
  },

  historyButton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#654571',
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    padding: 20,
    paddingBottom: 20,
  },

  welcomeContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  aiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E9DDF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  robot: {
    fontSize: 30,
  },

  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4D315C',
    marginBottom: 7,
  },

  welcomeText: {
    textAlign: 'center',
    color: '#665E68',
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 25,
  },

  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    backgroundColor: '#654571',
    borderRadius: 18,
    borderBottomRightRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginBottom: 12,
  },

  userMessageText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 19,
  },

  aiMessage: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
    backgroundColor: '#F4EEF5',
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginBottom: 12,
  },

  aiMessageText: {
    color: '#5D5660',
    fontSize: 13,
    lineHeight: 19,
  },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#DDD5D6',
  },

  inputContainer: {
    flex: 1,
    height: 48,
    backgroundColor: '#F4EEF5',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginRight: 8,
  },

  inputSparkle: {
    fontSize: 16,
    color: '#765582',
    marginRight: 5,
  },

  input: {
    flex: 1,
    height: 48,
    color: '#4D4650',
    fontSize: 13,
    paddingRight: 10,
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5A3B68',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 2,
  },
});
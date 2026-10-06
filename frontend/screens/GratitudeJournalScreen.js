import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';


export default function GratitudeJournalScreen() {

  const [entry, setEntry] = useState('');
  const [savedEntry, setSavedEntry] = useState('');
  const [message, setMessage] = useState('');


  const handleSave = () => {

    if (entry.trim() === '') {

      setMessage('Please write something before saving.');

      return;
    }


    setSavedEntry(entry);

    setMessage('✓ Entry saved');

    setEntry('');

  };


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Gratitude Journal
      </Text>


      <Text style={styles.subtitle}>
        Take a moment to reflect on something positive.
      </Text>


      {/* Journal Card */}

      <View style={styles.journalCard}>

        <Text style={styles.question}>
          What are you grateful for today?
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Today I'm grateful for..."
          placeholderTextColor="#A3ADA7"
          value={entry}
          onChangeText={setEntry}
          multiline
          textAlignVertical="top"
        />


        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >

          <Text style={styles.saveButtonText}>
            Save Entry
          </Text>

        </TouchableOpacity>


        {message !== '' && (

          <Text style={styles.message}>
            {message}
          </Text>

        )}

      </View>


      {/* Previous Entry */}

      {savedEntry !== '' && (

        <View style={styles.previousSection}>

          <Text style={styles.sectionTitle}>
            Today's Entry
          </Text>


          <View style={styles.entryCard}>

            <Text style={styles.entryText}>
              "{savedEntry}"
            </Text>

          </View>

        </View>

      )}

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F3',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    marginTop: 25,
    fontSize: 27,
    fontWeight: '700',
    color: '#304F4A',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#89928E',
    lineHeight: 19,
  },

  journalCard: {
    marginTop: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
  },

  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#30433E',
    marginBottom: 15,
  },

  input: {
    height: 180,
    borderWidth: 1,
    borderColor: '#DCE3DD',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#304F4A',
    backgroundColor: '#FAFBF9',
  },

  saveButton: {
    marginTop: 15,
    backgroundColor: '#304F4A',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  message: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#6F947A',
  },

  previousSection: {
    marginTop: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#304F4A',
    marginBottom: 10,
  },

  entryCard: {
    backgroundColor: '#F7F2E8',
    borderRadius: 18,
    padding: 18,
  },

  entryText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#52665D',
    fontStyle: 'italic',
  },

});
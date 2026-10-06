import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';


export default function MoodCheckinScreen({ navigation }) {

  const [selectedMood, setSelectedMood] = useState('Good');

  const [note, setNote] = useState('');

  const [selectedFeelings, setSelectedFeelings] = useState([
    'Motivated',
    'Anxious',
  ]);

  const [saved, setSaved] = useState(false);


  const moods = [
    {
      name: 'Awful',
      emoji: '😞',
    },
    {
      name: 'Not Great',
      emoji: '😕',
    },
    {
      name: 'Okay',
      emoji: '😐',
    },
    {
      name: 'Good',
      emoji: '🙂',
    },
    {
      name: 'Amazing',
      emoji: '😄',
    },
  ];


  const feelings = [
    'Stressed',
    'Tired',
    'Motivated',
    'Anxious',
    'Calm',
  ];


  const toggleFeeling = (feeling) => {

    if (selectedFeelings.includes(feeling)) {

      setSelectedFeelings(
        selectedFeelings.filter(item => item !== feeling)
      );

    } else {

      setSelectedFeelings([
        ...selectedFeelings,
        feeling,
      ]);

    }

  };


  const saveCheckin = () => {

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);

  };


  return (
    <View style={styles.container}>

      {/* Background decoration */}
      <View style={styles.backgroundBlob} />

      <View style={styles.decorativeLeaf}>
        <Text style={styles.leafDecoration}>
          🌿
        </Text>
      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >


        {/* Header */}
        <View style={styles.header}>

          <View style={styles.headerLeft}>

            <Text style={styles.leafIcon}>
              🍃
            </Text>

            <Text style={styles.headerTitle}>
              Mood Check-in
            </Text>

          </View>

        </View>


        {/* Main Heading */}
        <View style={styles.headingSection}>

          <Text style={styles.mainHeading}>
            How are you feeling today?
          </Text>

          <Text style={styles.subtitle}>
            Take a moment to check in with yourself.
          </Text>

          <Text style={styles.sectionHeading}>
            Mood Check-in
          </Text>

        </View>


        {/* Mood Options */}
        <View style={styles.moodOptions}>

          {moods.map((mood) => {

            const isSelected = selectedMood === mood.name;

            return (

              <TouchableOpacity
                key={mood.name}
                style={[
                  styles.moodCard,
                  isSelected && styles.selectedMoodCard,
                ]}
                onPress={() => setSelectedMood(mood.name)}
              >

                <Text style={styles.moodEmoji}>
                  {mood.emoji}
                </Text>

                <Text
                  style={[
                    styles.moodLabel,
                    isSelected && styles.selectedMoodLabel,
                  ]}
                >
                  {mood.name}
                </Text>

              </TouchableOpacity>

            );

          })}

        </View>


        {/* Note */}
        <View style={styles.noteSection}>

          <Text style={styles.noteLabel}>
            Add a note (optional)
          </Text>

          <TextInput
            style={styles.noteInput}
            placeholder="How was your day? Anything on your mind?"
            placeholderTextColor="#8B7896"
            value={note}
            onChangeText={(text) => {

              if (text.length <= 300) {
                setNote(text);
              }

            }}
            multiline
            textAlignVertical="top"
            maxLength={300}
          />

          <Text style={styles.characterCount}>
            {note.length}/300
          </Text>

        </View>


        {/* Feelings */}
        <View style={styles.feelingsSection}>

          <Text style={styles.feelingsLabel}>
            What are you feeling? (Select any that apply)
          </Text>


          <View style={styles.feelingsRow}>

            {feelings.map((feeling) => {

              const isSelected = selectedFeelings.includes(feeling);

              return (

                <TouchableOpacity
                  key={feeling}
                  style={[
                    styles.feelingChip,
                    isSelected && styles.selectedFeelingChip,
                  ]}
                  onPress={() => toggleFeeling(feeling)}
                >

                  <Text
                    style={[
                      styles.feelingText,
                      isSelected && styles.selectedFeelingText,
                    ]}
                  >
                    {feeling}
                  </Text>


                  {isSelected && (

                    <View style={styles.checkCircle}>

                      <Text style={styles.checkText}>
                        ✓
                      </Text>

                    </View>

                  )}

                </TouchableOpacity>

              );

            })}

          </View>

        </View>


        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveCheckin}
        >

          <Text style={styles.saveButtonText}>
            Save Check-in
          </Text>

        </TouchableOpacity>


        {/* Confirmation */}
        {saved && (

          <View style={styles.confirmation}>

            <Text style={styles.confirmationText}>
              ✓ Check-in saved successfully
            </Text>

          </View>

        )}


        {/* Empty space before navigation */}
        <View style={styles.bottomSpace} />


      </ScrollView>


      {/* Custom Bottom Navigation */}
      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Dashboard')}
        >

          <Text style={styles.navText}>
            Dashboard
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navItem}
        >

          <Text style={styles.activeNavText}>
            Mood Check-in
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('AI Analysis')}
        >

          <Text style={styles.navText}>
            AI Analysis
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Guidance')}
        >

          <Text style={styles.navText}>
            Guidance
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('More')}
        >

          <Text style={styles.navText}>
            More
          </Text>

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


  scrollContent: {
    paddingBottom: 30,
  },


  /* Background */

  backgroundBlob: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 330,
    height: 210,
    backgroundColor: '#EBCDD6',
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 160,
  },


  decorativeLeaf: {
    position: 'absolute',
    top: 85,
    right: -5,
    opacity: 0.45,
  },


  leafDecoration: {
    fontSize: 70,
    transform: [
      { rotate: '25deg' },
    ],
  },


  /* Header */

  header: {
    marginTop: 45,
    marginHorizontal: 20,
  },


  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  leafIcon: {
    fontSize: 22,
    marginRight: 7,
  },


  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#234F4A',
  },


  /* Heading */

  headingSection: {
    marginTop: 25,
    alignItems: 'center',
    paddingHorizontal: 20,
  },


  mainHeading: {
    fontSize: 25,
    fontWeight: '800',
    color: '#4A2E6B',
    textAlign: 'center',
  },


  subtitle: {
    marginTop: 7,
    fontSize: 13,
    color: '#65536D',
    textAlign: 'center',
  },


  sectionHeading: {
    marginTop: 15,
    fontSize: 17,
    fontWeight: '800',
    color: '#4A2E6B',
    textAlign: 'center',
  },


  /* Mood Cards */

  moodOptions: {
    marginTop: 18,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  moodCard: {
    width: 58,
    height: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },


  selectedMoodCard: {
    borderWidth: 2,
    borderColor: '#4A2E6B',
  },


  moodEmoji: {
    fontSize: 26,
    marginBottom: 7,
  },


  moodLabel: {
    fontSize: 9,
    color: '#655D67',
    textAlign: 'center',
  },


  selectedMoodLabel: {
    color: '#4A2E6B',
    fontWeight: '700',
  },


  /* Note */

  noteSection: {
    marginTop: 18,
    marginHorizontal: 20,
    height: 125,
    backgroundColor: '#CFC1E1',
    borderRadius: 15,
    padding: 13,
  },


  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A2E6B',
  },


  noteInput: {
    flex: 1,
    marginTop: 5,
    padding: 0,
    fontSize: 12,
    color: '#4A3C50',
  },


  characterCount: {
    position: 'absolute',
    right: 12,
    bottom: 9,
    fontSize: 10,
    color: '#6D587B',
  },


  /* Feelings */

  feelingsSection: {
    marginTop: 15,
    marginHorizontal: 20,
  },


  feelingsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A2E6B',
    marginBottom: 10,
  },


  feelingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  feelingChip: {
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#74558E',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },


  selectedFeelingChip: {
    backgroundColor: '#D7CBE7',
    borderWidth: 0,
  },


  feelingText: {
    fontSize: 9,
    color: '#4A2E6B',
  },


  selectedFeelingText: {
    fontWeight: '600',
  },


  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7B5A9B',
    marginLeft: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },


  checkText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },


  /* Save */

  saveButton: {
    marginTop: 18,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#4A2E6B',
    alignItems: 'center',
    justifyContent: 'center',
  },


  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D8C5EA',
  },


  /* Confirmation */

  confirmation: {
    marginTop: 8,
    alignItems: 'center',
  },


  confirmationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A2E6B',
  },


  bottomSpace: {
    height: 90,
  },


  /* Bottom Navigation */

  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 10,
    height: 58,
    borderRadius: 25,
    backgroundColor: '#C9B8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    elevation: 4,
  },


  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  navText: {
    fontSize: 9,
    color: '#353039',
    textAlign: 'center',
  },


  activeNavText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#241B2C',
    textAlign: 'center',
  },

});
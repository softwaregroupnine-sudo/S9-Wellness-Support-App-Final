import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';


export default function DashboardScreen({ navigation }) {

  return (
    <View style={styles.container}>

      {/* Background decoration */}
      <View style={styles.backgroundBlob} />


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
              Dashboard
            </Text>

          </View>

          {/* Temporary bell placeholder */}
          <Text style={styles.bellIcon}>
            ♡
          </Text>

        </View>


        {/* Greeting + Daily Streak */}
        <View style={styles.greetingSection}>

          <View style={styles.greetingText}>

            <Text style={styles.greeting}>
              Good morning,
            </Text>

            <Text style={styles.student}>
              Student
            </Text>

            <Text style={styles.subtitle}>
              Small steps today. Big dreams tomorrow.
            </Text>

          </View>


          {/* Daily Streak */}
          <View style={styles.streakCard}>

            <Text style={styles.streakTitle}>
              Daily Streak
            </Text>

            <View style={styles.streakContent}>

              <Text style={styles.flame}>
                🔥
              </Text>

              <View>

                <Text style={styles.streakNumber}>
                  7
                </Text>

                <Text style={styles.days}>
                  Days
                </Text>

              </View>

            </View>

          </View>

        </View>


        {/* Mood Check-in Card */}
        <View style={styles.moodCard}>

          <View style={styles.moodTitleRow}>

            <Text style={styles.heartIcon}>
              ♥
            </Text>

            <Text style={styles.moodTitle}>
              How are you feeling right now?
            </Text>

          </View>


          <Text style={styles.moodDescription}>
            Your mood matters. Check in with yourself.
          </Text>


          {/* Mood Options */}
          <View style={styles.moodOptions}>

            <View style={styles.moodOption}>
              <View style={[styles.emojiCircle, styles.awful]}>
                <Text style={styles.emoji}>
                  😞
                </Text>
              </View>

              <Text style={styles.moodLabel}>
                Awful
              </Text>
            </View>


            <View style={styles.moodOption}>
              <View style={[styles.emojiCircle, styles.notGreat]}>
                <Text style={styles.emoji}>
                  😕
                </Text>
              </View>

              <Text style={styles.moodLabel}>
                Not Great
              </Text>
            </View>


            <View style={styles.moodOption}>
              <View style={[styles.emojiCircle, styles.okay]}>
                <Text style={styles.emoji}>
                  😐
                </Text>
              </View>

              <Text style={styles.moodLabel}>
                Okay
              </Text>
            </View>


            <View style={styles.moodOption}>
              <View style={[styles.emojiCircle, styles.good]}>
                <Text style={styles.emoji}>
                  🙂
                </Text>
              </View>

              <Text style={styles.moodLabel}>
                Good
              </Text>
            </View>


            <View style={styles.moodOption}>
              <View style={[styles.emojiCircle, styles.amazing]}>
                <Text style={styles.emoji}>
                  😄
                </Text>
              </View>

              <Text style={styles.moodLabel}>
                Amazing
              </Text>
            </View>

          </View>


          {/* Mood Check-in Button */}
          <TouchableOpacity style={styles.moodButton}>

            <Text style={styles.moodButtonText}>
              Mood Check-In
            </Text>

          </TouchableOpacity>

        </View>


        {/* Personalised Guidance Card */}
        <View style={styles.guidanceCard}>

          <View style={styles.guidanceTitleRow}>

            <Text style={styles.sparkleIcon}>
              ✦
            </Text>

            <Text style={styles.guidanceTitle}>
              Personalised Guidance
            </Text>

          </View>


          <Text style={styles.guidanceDescription}>
            Tailored support for where you are.
          </Text>


          <View style={styles.divider} />


          {/* Guidance Quote */}
          <View style={styles.quoteRow}>

            <Text style={styles.quoteIcon}>
              “
            </Text>

            <Text style={styles.quoteText}>
              It's okay to feel overwhelmed. You're not alone, and every small step counts.
            </Text>

            <Text style={styles.chevron}>
              ›
            </Text>

          </View>


          <View style={styles.divider} />

        </View>


        {/* Guidance Links */}
        <View style={styles.guidanceLinks}>

          <TouchableOpacity>

            <Text style={styles.seeGuidance}>
              See my guidance
            </Text>

          </TouchableOpacity>


          <TouchableOpacity>

            <Text style={styles.viewAll}>
              View all
            </Text>

          </TouchableOpacity>

        </View>


        {/* Recommended for You */}
        <View style={styles.recommendedSection}>

          <Text style={styles.recommendedTitle}>
            Recommended for You
          </Text>


          {/* Breathing Exercise */}
          <TouchableOpacity
  style={styles.recommendationCard}
  onPress={() => navigation.navigate('BreathingExercise')}
>

            <View style={[styles.recommendationIcon, styles.breathingIcon]}>
              <Text style={styles.iconText}>
                📖
              </Text>
            </View>

            <View style={styles.recommendationText}>

              <Text style={styles.recommendationTitle}>
                Breathing Exercise
              </Text>

              <Text style={styles.recommendationDescription}>
                3 min • Carry your mind
              </Text>

            </View>

            <Text style={styles.recommendationChevron}>
              ›
            </Text>

          </TouchableOpacity>


          {/* Focus Timer */}

          <TouchableOpacity
           style={styles.recommendationCard}
          onPress={() => navigation.navigate('FocusTimer')}
          >
            <View style={[styles.recommendationIcon, styles.focusIcon]}>
              <Text style={styles.iconText}>
                🎓
              </Text>
            </View>

            <View style={styles.recommendationText}>

              <Text style={styles.recommendationTitle}>
                Focus Timer
              </Text>

              <Text style={styles.recommendationDescription}>
                20 min • Stay productive
              </Text>

            </View>

            <Text style={styles.recommendationChevron}>
              ›
            </Text>

          </TouchableOpacity>


          {/* Gratitude Journal */}
          <TouchableOpacity
          style={styles.recommendationCard}
          onPress={() => navigation.navigate('GratitudeJournal')}
        >

            <View style={[styles.recommendationIcon, styles.gratitudeIcon]}>
              <Text style={styles.iconText}>
                🪷
              </Text>
            </View>

            <View style={styles.recommendationText}>

              <Text style={styles.recommendationTitle}>
                Gratitude Journal
              </Text>

              <Text style={styles.recommendationDescription}>
                5 min • Shift perspective
              </Text>

            </View>

            <Text style={styles.recommendationChevron}>
              ›
            </Text>

          </TouchableOpacity>

        </View>


      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F3',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  backgroundBlob: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 180,
    backgroundColor: '#C8DCC9',
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 80,
    borderTopLeftRadius: 120,
  },

  header: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  bellIcon: {
    fontSize: 25,
    color: '#234F4A',
  },

  greetingSection: {
    marginTop: 35,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  greetingText: {
    flex: 1,
  },

  greeting: {
    fontSize: 27,
    fontWeight: '700',
    color: '#7FA88A',
  },

  student: {
    fontSize: 27,
    fontWeight: '700',
    color: '#7FA88A',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: '#8B9B8F',
  },

  streakCard: {
    width: 115,
    height: 105,
    marginLeft: 10,
    backgroundColor: '#DCEBDD',
    borderRadius: 18,
    paddingTop: 12,
    paddingHorizontal: 10,
  },

  streakTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#355A4D',
    textAlign: 'center',
  },

  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  flame: {
    fontSize: 27,
    marginRight: 7,
  },

  streakNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: '#234F4A',
    lineHeight: 30,
  },

  days: {
    fontSize: 11,
    color: '#567166',
    textAlign: 'center',
  },

  moodCard: {
    marginTop: 25,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 2,
  },

  moodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heartIcon: {
    fontSize: 18,
    color: '#234F4A',
    marginRight: 8,
  },

  moodTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#263B36',
  },

  moodDescription: {
    fontSize: 12,
    color: '#89928E',
    marginTop: 5,
    marginLeft: 26,
  },

  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  moodOption: {
    alignItems: 'center',
    width: 55,
  },

  emojiCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 22,
  },

  awful: {
    backgroundColor: '#F4C7C7',
  },

  notGreat: {
    backgroundColor: '#F5D5B5',
  },

  okay: {
    backgroundColor: '#F3E7A5',
  },

  good: {
    backgroundColor: '#D5E8C9',
  },

  amazing: {
    backgroundColor: '#B9DDB8',
  },

  moodLabel: {
    fontSize: 9,
    color: '#59645F',
    marginTop: 5,
    textAlign: 'center',
  },

  moodButton: {
    marginTop: 18,
    backgroundColor: '#304F4A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  moodButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  guidanceCard: {
    marginTop: 18,
    marginHorizontal: 20,
    backgroundColor: '#F7F2E8',
    borderRadius: 20,
    padding: 18,
  },

  guidanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sparkleIcon: {
    fontSize: 20,
    color: '#7FA88A',
    marginRight: 8,
  },

  guidanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7FA88A',
  },

  guidanceDescription: {
    fontSize: 12,
    color: '#89928E',
    marginTop: 5,
    marginLeft: 28,
  },

  divider: {
    height: 1,
    backgroundColor: '#DDD8CC',
    marginVertical: 14,
  },

  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quoteIcon: {
    fontSize: 30,
    color: '#7FA88A',
    marginRight: 5,
    alignSelf: 'flex-start',
  },

  quoteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    color: '#52665D',
  },

  chevron: {
    fontSize: 27,
    color: '#7FA88A',
    marginLeft: 8,
  },

  guidanceLinks: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  seeGuidance: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6F947A',
  },

  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6F947A',
    textDecorationLine: 'underline',
  },

  recommendedSection: {
    marginTop: 24,
    marginHorizontal: 20,
  },

  recommendedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#304F4A',
    marginBottom: 12,
  },

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },

  recommendationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  breathingIcon: {
    backgroundColor: '#DCEAF2',
  },

  focusIcon: {
    backgroundColor: '#E4E1F1',
  },

  gratitudeIcon: {
    backgroundColor: '#E3EEDB',
  },

  iconText: {
    fontSize: 23,
  },

  recommendationText: {
    flex: 1,
  },

  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#30433E',
  },

  recommendationDescription: {
    fontSize: 11,
    color: '#89928E',
    marginTop: 4,
  },

  recommendationChevron: {
    fontSize: 26,
    color: '#7FA88A',
    marginLeft: 8,
  },

});
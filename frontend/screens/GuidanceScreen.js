import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function GuidanceScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.leafIcon}>🍃</Text>
          <Text style={styles.headerTitle}>Guidance</Text>
        </View>


        {/* Today's Guidance */}

        <View style={styles.guidanceCard}>

          <View style={styles.guidanceTopRow}>

            <View style={styles.leafCircle}>
              <Text style={styles.smallLeaf}>🍃</Text>
            </View>

            <Text style={styles.guidanceLabel}>
              Today's{'\n'}Guidance
            </Text>

          </View>

          <Text style={styles.guidanceTitle}>
            You're doing better{'\n'}than you think.
          </Text>

          <Text style={styles.guidanceText}>
            Take a breath. You've shown up for yourself today, and that
            matters. Small steps, big change.
          </Text>

          <Text style={styles.heart}>♡</Text>

          <Text style={styles.guidanceBranch}>
            🌿
          </Text>

        </View>


        {/* Category */}

        <Text style={styles.categoryTitle}>
          Managing Stress
        </Text>


        {/* Stress Tools */}

        <View style={styles.toolsCard}>

          <View style={styles.toolsHeader}>

            <Text style={styles.meditationIcon}>🧘</Text>

            <Text style={styles.toolsTitle}>
              Tools to help you{'\n'}feel calmer
            </Text>

            <Text style={styles.downChevron}>
             ⌄
            </Text>

          </View>


          {/* Breathing Exercise */}

          <TouchableOpacity
            style={styles.mediaRow}
            onPress={() => navigation.navigate('BreathingExercise')}
            activeOpacity={0.8}
          >

            <View style={styles.thumbnail}>
              <Text style={styles.playIcon}>▶</Text>
            </View>

            <View style={styles.mediaTextContainer}>

              <Text style={styles.mediaTitle}>
                5-Minute Breathing Space
              </Text>

              <Text style={styles.mediaSubtitle}>
                A quick breathing exercise to reset your mind.
              </Text>

            </View>

            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>5 min</Text>
            </View>

          </TouchableOpacity>


          <View style={styles.divider} />


          {/* Letting Go */}

          <TouchableOpacity
            style={styles.mediaRow}
            activeOpacity={0.8}
          >

            <View style={styles.mountainThumbnail}>
              <Text style={styles.mountain}>⌁</Text>
              <Text style={styles.mountainShape}>△</Text>
            </View>

            <View style={styles.mediaTextContainer}>

              <Text style={styles.mediaTitle}>
                Letting Go of Overwhelm
              </Text>

              <Text style={styles.mediaSubtitle}>
                A guided exercise to release stress and find clarity.
              </Text>

            </View>

            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>7 min</Text>
            </View>

          </TouchableOpacity>

        </View>


        {/* Sleep Better */}

        <TouchableOpacity
          style={styles.categoryRow}
          activeOpacity={0.8}
        >

          <View style={[styles.categoryIcon, styles.sleepIcon]}>
            <Text style={styles.categoryEmoji}>☾</Text>
            <Text style={styles.star}>✦</Text>
          </View>

          <View style={styles.categoryTextContainer}>

            <Text style={styles.categoryRowTitle}>
              Sleep Better
            </Text>

            <Text style={styles.categorySubtitle}>
              Improve your sleep quality
            </Text>

          </View>

          <Text style={styles.chevron}>
            ›
          </Text>

        </TouchableOpacity>


        {/* Building Habits */}

        <TouchableOpacity
          style={styles.categoryRow}
          activeOpacity={0.8}
        >

          <View style={[styles.categoryIcon, styles.habitIcon]}>
            <Text style={styles.categoryEmoji}>🌱</Text>
          </View>

          <View style={styles.categoryTextContainer}>

            <Text style={styles.categoryRowTitle}>
              Building Habits
            </Text>

            <Text style={styles.categorySubtitle}>
              Create routines that stick
            </Text>

          </View>

          <Text style={styles.chevron}>
            ›
          </Text>

        </TouchableOpacity>


        {/* Talking to Someone */}

        <TouchableOpacity
          style={styles.categoryRow}
          activeOpacity={0.8}
        >

          <View style={[styles.categoryIcon, styles.talkingIcon]}>
            <Text style={styles.categoryEmoji}>👥</Text>
          </View>

          <View style={styles.categoryTextContainer}>

            <Text style={styles.categoryRowTitle}>
              Talking to Someone
            </Text>

            <Text style={styles.categorySubtitle}>
              Support when you need it
            </Text>

          </View>

          <Text style={styles.chevron}>
            ›
          </Text>

        </TouchableOpacity>


        <View style={styles.bottomSpace} />

      </ScrollView>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#DDD5D6',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 30,
  },


  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  leafIcon: {
    fontSize: 25,
    marginRight: 7,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#31504F',
  },


  /* Today's Guidance */

  guidanceCard: {
    minHeight: 195,
    backgroundColor: '#AEBBA5',
    borderRadius: 23,
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'visible',
  },

  guidanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leafCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F8F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  smallLeaf: {
    fontSize: 20,
  },

  guidanceLabel: {
    color: '#5A3B68',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
  },

  guidanceTitle: {
    color: '#5A3B68',
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '800',
    marginTop: 13,
    paddingRight: 45,
  },

  guidanceText: {
    color: '#685D70',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    paddingRight: 25,
  },

  heart: {
    position: 'absolute',
    right: 25,
    top: 56,
    color: '#5A3B68',
    fontSize: 34,
    fontWeight: '300',
  },

  guidanceBranch: {
    position: 'absolute',
    right: 15,
    bottom: -25,
    fontSize: 58,
    transform: [{ rotate: '-15deg' }],
  },


  /* Category */

  categoryTitle: {
    color: '#5A3B68',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 36,
    marginBottom: 10,
  },


  /* Stress Tools */

  toolsCard: {
    backgroundColor: '#AEBBA5',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 8,
  },

  toolsHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },

  meditationIcon: {
    fontSize: 25,
    width: 43,
  },

  toolsTitle: {
    flex: 1,
    color: '#5A3B68',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },

  downChevron: {
    color: '#5A3B68',
    fontSize: 27,
    marginRight: 4,
  },


  /* Media rows */

  mediaRow: {
    minHeight: 83,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  thumbnail: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#C8B7D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  playIcon: {
    color: '#FFFFFF',
    fontSize: 21,
    marginLeft: 2,
  },

  mountainThumbnail: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#777BA8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },

  mountain: {
    color: '#C9D0E8',
    fontSize: 30,
    position: 'absolute',
    top: 4,
  },

  mountainShape: {
    color: '#E4DDF0',
    fontSize: 35,
    position: 'absolute',
    bottom: -6,
  },

  mediaTextContainer: {
    flex: 1,
    paddingRight: 5,
  },

  mediaTitle: {
    color: '#5A3B68',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
  },

  mediaSubtitle: {
    color: '#706676',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },

  timeBadge: {
    backgroundColor: '#F6EFF3',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 4,
  },

  timeText: {
    color: '#6A5870',
    fontSize: 9,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#96A58F',
    marginHorizontal: 2,
  },


  /* Category rows */

  categoryRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },

  sleepIcon: {
    backgroundColor: '#C7D8E6',
  },

  habitIcon: {
    backgroundColor: '#DCD0E8',
  },

  talkingIcon: {
    backgroundColor: '#E8DDAE',
  },

  categoryEmoji: {
    fontSize: 22,
  },

  star: {
    position: 'absolute',
    right: 9,
    top: 8,
    color: '#FFFFFF',
    fontSize: 9,
  },

  categoryTextContainer: {
    flex: 1,
  },

  categoryRowTitle: {
    color: '#5A3B68',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 3,
  },

  categorySubtitle: {
    color: '#706676',
    fontSize: 11,
    lineHeight: 15,
  },

  chevron: {
    color: '#6A5870',
    fontSize: 27,
    marginLeft: 8,
  },

  bottomSpace: {
    height: 40,
  },

});
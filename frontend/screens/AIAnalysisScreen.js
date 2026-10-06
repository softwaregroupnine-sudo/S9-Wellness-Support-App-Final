import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';

export default function AIAnalysisScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  const moodData = [
    { day: 'Mon', value: 75 },
    { day: 'Tue', value: 40 },
    { day: 'Wed', value: 85 },
    { day: 'Thu', value: 55 },
    { day: 'Fri', value: 45 },
    { day: 'Sat', value: 10 },
    { day: 'Sun', value: 20 },
  ];

  const chartWidth = 340;
  const chartHeight = 110;

  const points = moodData
    .map((item, index) => {
      const x =
        8 + (index * (chartWidth - 16)) / (moodData.length - 1);

      const y = (item.value / 100) * (chartHeight - 10);

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>

      <View style={styles.backgroundBlob} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.header}>
          <Text style={styles.leafIcon}>🍃</Text>
          <Text style={styles.headerTitle}>AI Analysis</Text>
        </View>

        <View style={styles.insightCard}>

          <View style={styles.robotCircle}>
            <Text style={styles.robot}>🤖</Text>
          </View>

          <Text style={styles.sparkles}>✦</Text>

          <View style={styles.insightTextContainer}>
            <Text style={styles.insightTitle}>+ AI Insight</Text>

            <Text style={styles.insightText}>
              Your mood has been improving this week. Keep making time for
              activities that help you feel balanced.
            </Text>
          </View>

          <Text style={styles.cardLeaf}>🍃</Text>

        </View>

        <Text style={styles.caption}>
          Keep going—small steps, big impact.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mood Trend</Text>

          <View style={styles.toggle}>

            <TouchableOpacity
              style={[
                styles.toggleOption,
                selectedPeriod === 'Week' && styles.selectedToggle,
              ]}
              onPress={() => setSelectedPeriod('Week')}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedPeriod === 'Week' && styles.selectedToggleText,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleOption,
                selectedPeriod === 'Month' && styles.selectedToggle,
              ]}
              onPress={() => setSelectedPeriod('Month')}
            >
              <Text
                style={[
                  styles.toggleText,
                  selectedPeriod === 'Month' && styles.selectedToggleText,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.chartContainer}>

          <Svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          >

            <Polyline
              points={points}
              fill="none"
              stroke="#765582"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {moodData.map((item, index) => {

              const x =
                8 + (index * (chartWidth - 16)) / (moodData.length - 1);

              const y = (item.value / 100) * (chartHeight - 10);

              return (
                <Circle
                  key={item.day}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#654571"
                />
              );

            })}

          </Svg>

          <View style={styles.daysRow}>

            {moodData.map((item) => (
              <Text
                key={item.day}
                style={styles.dayText}
              >
                {item.day}
              </Text>
            ))}

          </View>

        </View>

        <Text style={styles.patternTitle}>
          Key Patterns
        </Text>

        <View style={styles.patternCard}>

          <Text style={styles.patternIcon}>☀️</Text>

          <Text style={styles.patternText}>
            Your mood tends to improve after taking time for yourself.
          </Text>

          <Text style={styles.chevron}>›</Text>

        </View>

        <View style={styles.patternCard}>

          <Text style={styles.patternIcon}>💤</Text>

          <Text style={styles.patternText}>
            Lower moods appear more often when you feel tired.
          </Text>

          <Text style={styles.chevron}>›</Text>

        </View>

        <View style={styles.patternCard}>

          <Text style={styles.patternIcon}>🌱</Text>

          <Text style={styles.patternText}>
            Your overall mood has shown positive changes this week.
          </Text>

          <Text style={styles.chevron}>›</Text>

        </View>

        <View style={styles.askTitleRow}>

          <Text style={styles.aiSparkle}>✦</Text>

          <Text style={styles.askTitle}>
            Ask AI
          </Text>

        </View>

        <TouchableOpacity
          style={styles.askRow}
          onPress={() => navigation.navigate('AIChat')}
          activeOpacity={0.8}
        >

          <View style={styles.askInputContainer}>

            <Text style={styles.inputSparkle}>
              ✦
            </Text>

            <Text style={styles.askInputText}>
              Ask something about your wellbeing...
            </Text>

          </View>

          <View style={styles.sendButton}>

            <Text style={styles.sendIcon}>
              ➤
            </Text>

          </View>

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

  backgroundBlob: {
    position: 'absolute',
    top: 0,
    right: -80,
    width: 280,
    height: 130,
    backgroundColor: '#B9C9B3',
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 30,
  },

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
    color: '#4D315C',
  },

  insightCard: {
    minHeight: 125,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },

  robotCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E9DDF0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  robot: {
    fontSize: 29,
  },

  sparkles: {
    position: 'absolute',
    left: 45,
    top: 17,
    color: '#8D6A9E',
    fontSize: 18,
  },

  insightTextContainer: {
    flex: 1,
  },

  insightTitle: {
    color: '#60416D',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },

  insightText: {
    color: '#5D5660',
    fontSize: 13,
    lineHeight: 19,
  },

  cardLeaf: {
    position: 'absolute',
    right: 8,
    bottom: -13,
    fontSize: 31,
    transform: [{ rotate: '-20deg' }],
  },

  caption: {
    textAlign: 'center',
    color: '#665E68',
    fontSize: 13,
    marginTop: 25,
    marginBottom: 25,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#4D315C',
    fontSize: 18,
    fontWeight: '700',
  },

  toggle: {
    flexDirection: 'row',
    backgroundColor: '#E9E1E2',
    borderRadius: 20,
    padding: 3,
  },

  toggleOption: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 17,
  },

  selectedToggle: {
    backgroundColor: '#5A3B68',
  },

  toggleText: {
    fontSize: 12,
    color: '#6D6570',
    fontWeight: '600',
  },

  selectedToggleText: {
    color: '#FFFFFF',
  },

  chartContainer: {
    marginBottom: 25,
  },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginTop: 3,
  },

  dayText: {
    color: '#716870',
    fontSize: 11,
  },

  patternTitle: {
    color: '#4D315C',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  patternCard: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F1F2',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  patternIcon: {
    fontSize: 19,
    width: 34,
  },

  patternText: {
    flex: 1,
    color: '#5D5660',
    fontSize: 12,
    lineHeight: 17,
  },

  chevron: {
    color: '#6A5673',
    fontSize: 25,
    marginLeft: 8,
  },

  askTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },

  aiSparkle: {
    fontSize: 21,
    color: '#654571',
    marginRight: 7,
  },

  askTitle: {
    color: '#4D315C',
    fontSize: 18,
    fontWeight: '700',
  },

  askRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  askInputContainer: {
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

  askInputText: {
    flex: 1,
    color: '#8C8490',
    fontSize: 12,
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

  bottomSpace: {
    height: 40,
  },

});
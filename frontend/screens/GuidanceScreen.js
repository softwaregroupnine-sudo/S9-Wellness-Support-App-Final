import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getGuidanceRecommendations } from '../services/api';

const ACTIVITY_DETAILS = {
  BreathingExercise: {
    subtitle: 'Take a moment to slow down and reset.',
    duration: '5 min',
    icon: '▶',
  },
  GratitudeJournal: {
    subtitle: 'Reflect on the things that matter to you.',
    duration: '5 min',
    icon: '✎',
  },
  FocusTimer: {
    subtitle: 'Focus on one manageable task at a time.',
    duration: '25 min',
    icon: '◷',
  },
  AIChat: {
    subtitle: 'Talk through what has been on your mind.',
    duration: 'Anytime',
    icon: '♡',
  },
};

export default function GuidanceScreen({ navigation, route }) {
  const participantId = route?.params?.user?.participant_id;

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const recommendationsRef = useRef(null);
  const requestIdRef = useRef(0);

  const loadRecommendations = useCallback(async () => {
    if (!participantId) {
      setError(
        'Your account information could not be found. Please log in again.'
      );
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    if (!recommendationsRef.current) {
      setLoading(true);
    }

    setError('');

    try {
      const data = await getGuidanceRecommendations(participantId);

      if (requestId === requestIdRef.current) {
        recommendationsRef.current = data;
        setRecommendations(data);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(
          err.message ||
            'Could not refresh your guidance. Please try again.'
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [participantId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function refreshOnFocus() {
        if (!participantId) {
          setError(
            'Your account information could not be found. Please log in again.'
          );
          setLoading(false);
          return;
        }

        const requestId = ++requestIdRef.current;

        if (!recommendationsRef.current) {
          setLoading(true);
        }

        setError('');

        try {
          const data = await getGuidanceRecommendations(participantId);

          if (isActive && requestId === requestIdRef.current) {
            recommendationsRef.current = data;
            setRecommendations(data);
          }
        } catch (err) {
          if (isActive && requestId === requestIdRef.current) {
            setError(
              err.message ||
                'Could not refresh your guidance. Please try again.'
            );
          }
        } finally {
          if (isActive && requestId === requestIdRef.current) {
            setLoading(false);
          }
        }
      }

      refreshOnFocus();

      return () => {
        isActive = false;
      };
    }, [participantId])
  );

  const activities = recommendations?.activities || [];

  function openActivity(activity) {
    if (activity?.route) {
      navigation.navigate(activity.route);
    }
  }

  function openSleepGuidance() {
    Alert.alert(
      'Sleep Better',
      'Dedicated sleep guidance is coming soon. For now, you can try the Breathing Exercise to help you relax.',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Breathing Exercise',
          onPress: () => navigation.navigate('BreathingExercise'),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.leafIcon}>🍃</Text>
          <Text style={styles.headerTitle}>Guidance</Text>
        </View>

        <View style={styles.guidanceCard}>
          <View style={styles.guidanceTopRow}>
            <View style={styles.leafCircle}>
              <Text style={styles.smallLeaf}>🍃</Text>
            </View>
            <Text style={styles.guidanceLabel}>
              Today's{'\n'}Guidance
            </Text>
          </View>

          {loading && !recommendations ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator color="#5A3B68" size="small" />
              <Text style={styles.statusText}>
                Finding guidance for you...
              </Text>
            </View>
          ) : error && !recommendations ? (
            <View>
              <Text style={styles.guidanceTitle}>
                Your guidance is temporarily unavailable.
              </Text>
              <Text style={styles.guidanceText}>{error}</Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadRecommendations}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : recommendations ? (
            <>
              <Text style={styles.guidanceTitle}>
                {recommendations.title}
              </Text>
              <Text style={styles.guidanceText}>
                {recommendations.message}
              </Text>

              {error ? (
                <Text style={styles.refreshNotice}>
                  Showing your last loaded guidance. Refresh failed.
                </Text>
              ) : null}
            </>
          ) : null}

          <Text style={styles.heart}>♡</Text>
          <Text style={styles.guidanceBranch}>🌿</Text>
        </View>

        <Text style={styles.categoryTitle}>
          {recommendations?.category || 'Your wellbeing'}
        </Text>

        <View style={styles.toolsCard}>
          <View style={styles.toolsHeader}>
            <Text style={styles.meditationIcon}>🧘</Text>
            <Text style={styles.toolsTitle}>
              Activities to support{'\n'}your wellbeing
            </Text>
            <Text style={styles.downChevron}>⌄</Text>
          </View>

          {loading && !recommendations ? (
            <View style={styles.activityStatus}>
              <ActivityIndicator color="#5A3B68" />
              <Text style={styles.statusText}>
                Loading activities...
              </Text>
            </View>
          ) : error && !recommendations ? (
            <Text style={styles.emptyText}>
              Activities could not be loaded. Please try again.
            </Text>
          ) : activities.length === 0 ? (
            <Text style={styles.emptyText}>
              No activities are available right now.
            </Text>
          ) : (
            activities.map((activity, index) => {
              const details = ACTIVITY_DETAILS[activity.route] || {
                subtitle: 'An activity to support your wellbeing.',
                duration: 'Anytime',
                icon: '♡',
              };

              return (
                <React.Fragment key={`${activity.route}-${index}`}>
                  {index > 0 && <View style={styles.divider} />}

                  <TouchableOpacity
                    style={styles.mediaRow}
                    onPress={() => openActivity(activity)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.thumbnail,
                        index % 2 === 1 && styles.secondThumbnail,
                      ]}
                    >
                      <Text style={styles.playIcon}>
                        {details.icon}
                      </Text>
                    </View>

                    <View style={styles.mediaTextContainer}>
                      <Text style={styles.mediaTitle}>
                        {activity.title}
                      </Text>
                      <Text style={styles.mediaSubtitle}>
                        {details.subtitle}
                      </Text>
                    </View>

                    <View style={styles.timeBadge}>
                      <Text style={styles.timeText}>
                        {details.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })
          )}
        </View>

        <TouchableOpacity
          style={styles.categoryRow}
          activeOpacity={0.8}
          onPress={openSleepGuidance}
        >
          <View style={[styles.categoryIcon, styles.sleepIcon]}>
            <Text style={styles.categoryEmoji}>☾</Text>
            <Text style={styles.star}>✦</Text>
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryRowTitle}>Sleep Better</Text>
            <Text style={styles.categorySubtitle}>
              Take a moment to relax and unwind
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryRow}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('FocusTimer')}
        >
          <View style={[styles.categoryIcon, styles.habitIcon]}>
            <Text style={styles.categoryEmoji}>🌱</Text>
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryRowTitle}>Building Habits</Text>
            <Text style={styles.categorySubtitle}>
              Create routines that stick
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryRow}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AIChat')}
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
          <Text style={styles.chevron}>›</Text>
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
    lineHeight: 26,
    fontWeight: '800',
    marginTop: 13,
    paddingRight: 38,
  },
  guidanceText: {
    color: '#685D70',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    paddingRight: 15,
  },
  refreshNotice: {
    color: '#685D70',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 15,
  },
  statusText: {
    color: '#685D70',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
    flexShrink: 1,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6EFF3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
  },
  retryText: {
    color: '#5A3B68',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryTitle: {
    color: '#5A3B68',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 36,
    marginBottom: 10,
  },
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
  mediaRow: {
    minHeight: 83,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },
  thumbnail: {
    width: 52,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#C8B7D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  secondThumbnail: {
    backgroundColor: '#777BA8',
  },
  playIcon: {
    color: '#FFFFFF',
    fontSize: 21,
  },
  mediaTextContainer: {
    flex: 1,
    paddingRight: 3,
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
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginLeft: 3,
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
  activityStatus: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    color: '#685D70',
    fontSize: 12,
    lineHeight: 18,
    paddingVertical: 14,
  },
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
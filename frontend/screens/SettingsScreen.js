import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const handlePress = (title) => {
    Alert.alert(title, `${title} will be available here.`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  const SettingsRow = ({
    icon,
    title,
    color = '#263D39',
    onPress,
    showIcon = true,
  }) => (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress || (() => handlePress(title))}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {showIcon && (
          <Ionicons name={icon} size={23} color={color} />
        )}
      </View>

      <Text style={[styles.rowTitle, { color }]}>{title}</Text>

      <Feather name="chevron-right" size={22} color="#7B8583" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4EFE8" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="leaf" size={27} color="#466B58" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => handlePress('View Profile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color="#76678B" />
          </View>

          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Ava Thompson</Text>
            <Text style={styles.profileMore}>More</Text>
          </View>

          <View style={styles.viewProfile}>
            <Text style={styles.viewProfileText}>View profile</Text>
            <Feather name="chevron-right" size={20} color="#7B8583" />
          </View>
        </TouchableOpacity>

        <Text style={styles.tagline}>Mindful every day</Text>

        {/* Group 1 */}
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            color="#79688F"
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="shield-checkmark-outline"
            title="Privacy & Data"
            color="#79688F"
          />
        </View>

        {/* Group 2 */}
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="book-outline"
            title="Wellness Library"
            color="#668369"
          />
          <View style={styles.divider} />
          <SettingsRow
            icon="school-outline"
            title="Study Toolkit"
            color="#79688F"
          />
        </View>

        {/* Group 3 */}
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="people-outline"
            title="Emergency Contacts"
            color="#668369"
          />
          <View style={styles.divider} />
          <SettingsRow
            title="Help & Support"
            showIcon={false}
          />

          <TouchableOpacity
            style={styles.logoutRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4EFE8',
  },

  scrollContent: {
    paddingHorizontal: '4%',
    paddingTop: 48,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    marginLeft: 4,
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#263D39',
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E7DFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileDetails: {
    flex: 1,
    marginLeft: 14,
  },

  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#263D39',
  },

  profileMore: {
    fontSize: 21,
    fontWeight: '700',
    color: '#263D39',
    marginTop: 8,
  },

  viewProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },

  viewProfileText: {
    color: '#7B8583',
    fontSize: 12,
  },

  tagline: {
    color: '#7B8583',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 20,
  },

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 18,
    overflow: 'hidden',
  },

  settingsRow: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  iconContainer: {
    width: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E5E1',
  },

  logoutRow: {
    minHeight: 44,
    justifyContent: 'center',
    paddingLeft: 50,
  },

  logoutText: {
    color: '#D14D48',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
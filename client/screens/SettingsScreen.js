import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Account Settings</Text>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditProfile')}>
        <Ionicons name="person-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ChangePassword')}>
        <Ionicons name="lock-closed-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Privacy')}>
        <Ionicons name="shield-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Privacy Settings</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Notification Settings</Text>
      <View style={styles.settingItem}>
        <Ionicons name="notifications-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Push Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EmailPreferences')}>
        <Ionicons name="mail-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Email Preferences</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>App Preferences</Text>
      <View style={styles.settingItem}>
        <Ionicons name="moon-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch value={darkModeEnabled} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Language')}>
        <Ionicons name="globe-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Language</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Support</Text>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('HelpCenter')}>
        <Ionicons name="help-circle-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ContactSupport')}>
        <Ionicons name="call-outline" size={24} color="#4a90e2" />
        <Text style={styles.settingText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Logout')}>
        <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        <Text style={[styles.settingText, styles.logoutText]}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});

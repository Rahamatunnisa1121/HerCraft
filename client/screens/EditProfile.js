import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch the token from AsyncStorage
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return null;
      }
      return token;
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve token');
      console.error(error);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    const token = await getToken();
    if (!token) return; // Don't proceed if no token is found

    try {
      const response = await fetch('http://192.168.6.51:5000/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the header
        },
        body: JSON.stringify({ name, email }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Profile updated successfully');
      } else {
        Alert.alert('Error', result.message || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to update profile');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Your Profile</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',  // Light background color for a clean look
    padding: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2F3A48',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  form: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007BFF',  // Bright, professional blue
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

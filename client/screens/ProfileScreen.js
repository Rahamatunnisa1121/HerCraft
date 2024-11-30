import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCost, setProductCost] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [upiId, setUpiId] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [itemImage, setItemImage] = useState('');

  // Function to fetch user profile with token
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch('http://192.168.157.51:5000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserName(data.username || 'User');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      Alert.alert('Error', 'Could not load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    navigation.navigate('Home');
    await AsyncStorage.removeItem('token');
  };

  const handleAddInnovation = async () => {
    if (!productName || !productCost || !productDescription || !upiId || !street || !city || !state || !zipCode || !country || !phone || !itemImage) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.157.51:5000/api/innovations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName,
          cost: productCost,
          description: productDescription,
          upiId: upiId,
          address: {
            street,
            city,
            state,
            zipCode,
            country,
          },
          contact: { phone },
          itemImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add innovation');
      }

      Alert.alert('Success', 'Innovation added successfully');
      setProductName('');
      setProductCost('');
      setProductDescription('');
      setUpiId('');
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setCountry('');
      setPhone('');
      setItemImage('');
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to add innovation:', error);
      Alert.alert('Error', 'Could not add innovation');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.profileName}>{loading ? 'Loading...' : userName}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Dass')} style={styles.button}>
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.featuresContainer}>
          <TouchableOpacity style={styles.feature} onPress={() => navigation.navigate('Market')}>
            <Ionicons name="basket-outline" size={50} color="#4a90e2" />
            <Text style={styles.featureText}>Marketplace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feature} onPress={() => navigation.navigate('Community')}>
            <Ionicons name="people-outline" size={50} color="#4a90e2" />
            <Text style={styles.featureText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feature} onPress={() => navigation.navigate('Learning')}>
            <Ionicons name="book-outline" size={50} color="#4a90e2" />
            <Text style={styles.featureText}>Learning</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addInnovationButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addInnovationButtonText}>Add Innovation</Text>
        </TouchableOpacity>

        {/* Modal for Adding Innovation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Innovation Details</Text>
              <TextInput
                placeholder="Product Name"
                value={productName}
                onChangeText={setProductName}
                style={styles.input}
              />
              <TextInput
                placeholder="Product Cost"
                value={productCost}
                onChangeText={setProductCost}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Product Description"
                value={productDescription}
                onChangeText={setProductDescription}
                style={styles.input}
              />
              <TextInput
                placeholder="UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                style={styles.input}
              />
              <TextInput
                placeholder="Street Address"
                value={street}
                onChangeText={setStreet}
                style={styles.input}
              />
              <TextInput
                placeholder="City"
                value={city}
                onChangeText={setCity}
                style={styles.input}
              />
              <TextInput
                placeholder="State"
                value={state}
                onChangeText={setState}
                style={styles.input}
              />
              <TextInput
                placeholder="Zip Code"
                value={zipCode}
                onChangeText={setZipCode}
                style={styles.input}
              />
              <TextInput
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                style={styles.input}
              />
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />
              <TextInput
                placeholder="Item Image URL"
                value={itemImage}
                onChangeText={setItemImage}
                style={styles.input}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleAddInnovation}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>

      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  featuresContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 40,
  },
  feature: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f4f7',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    marginHorizontal: '10%',
  },
  featureText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addInnovationButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
  },
  addInnovationButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    color: '#4a90e2',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 100,
    right:120,
    backgroundColor: '#4a90e2',
    borderRadius: 50,
    padding: 10,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#e94e77',
    borderRadius: 50,
    padding: 10,
  },
});

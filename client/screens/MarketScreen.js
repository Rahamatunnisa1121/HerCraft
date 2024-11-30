import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.157.51:5000/api';

export default function MarketScreen() {
  const [innovations, setInnovations] = useState([]);
  const [filteredInnovations, setFilteredInnovations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch innovations from the backend
  const fetchInnovations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/innovations1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInnovations(response.data);
      setFilteredInnovations(response.data);
    } catch (error) {
      console.error('Failed to fetch innovations:', error);
      Alert.alert('Error', 'Could not load innovations');
    }
  };

  useEffect(() => {
    fetchInnovations();
  }, []);

  // Filter innovations based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = innovations.filter((innovation) =>
        innovation.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredInnovations(filtered);
    } else {
      setFilteredInnovations(innovations);
    }
  };

  // Handle purchase functionality via UPI
  const handleBuy = async (innovation) => {
    if (!innovation.upiId) {
      Alert.alert('Error', 'Seller UPI ID not available');
      return;
    }

    const upiUrl = `upi://pay?pa=${encodeURIComponent(innovation.upiId)}&pn=${encodeURIComponent(
      innovation.name
    )}&am=${encodeURIComponent(innovation.cost)}&cu=INR&tn=${encodeURIComponent(
      `Purchase of ${innovation.name}`
    )}`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        await Linking.openURL(upiUrl);
        Alert.alert('Success', 'Payment initiated. Please complete it in the UPI app.');

        // Record purchase after payment initiation
        await recordPurchase(innovation);
        
        // Update `totalSold` and `earned` in the backend
        await updateSales(innovation);

        // Refresh the list of innovations to reflect updated totals
        fetchInnovations();
      } else {
        Alert.alert('Error', 'No UPI app installed or URL not supported.');
      }
    } catch (error) {
      console.error('Error during UPI payment:', error);
      Alert.alert('Error', 'Payment or update failed. Please try again.');
    }
  };

  // Function to record the purchase in the backend
  const recordPurchase = async (innovation) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(
        `${API_URL}/purchases`,
        {
          productId: innovation._id,
          productName: innovation.name,
          cost: innovation.cost,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Error recording purchase:', error);
      Alert.alert('Error', 'Failed to record purchase');
    }
  };

  // Function to update sales info in the backend
  const updateSales = async (innovation) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const updateResponse = await axios.patch(
        `${API_URL}/innovations/${innovation._id}/update-sales`,
        { cost: innovation.cost },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedInnovation = updateResponse.data;
      Alert.alert(
        'Success',
        `Payment recorded! Total Sold: ${updatedInnovation.totalSold}, Earnings: ${updatedInnovation.earned}`
      );
    } catch (error) {
      console.error('Error updating sales:', error);
      Alert.alert('Error', 'Failed to update sales');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for an innovation..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredInnovations.map((innovation) => (
          <View key={innovation._id} style={styles.itemContainer}>
            <Image source={{ uri: innovation.itemImage }} style={styles.itemImage} />
            <Text style={styles.itemName}>{innovation.name}</Text>
            <Text style={styles.itemCost}>Cost: {innovation.cost}</Text>
            <Text style={styles.itemDescription}>{innovation.description}</Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => handleBuy(innovation)}
            >
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  scrollContainer: { flexGrow: 1 },
  itemContainer: { marginBottom: 20, borderWidth: 1, padding: 15, borderRadius: 10, borderColor: '#ddd' },
  itemImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  itemName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  itemCost: { fontSize: 16, color: 'green', marginBottom: 5 },
  itemDescription: { fontSize: 14, marginBottom: 15 },
  buyButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontSize: 18 },
});

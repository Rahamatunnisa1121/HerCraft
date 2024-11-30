import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function ItemDetailScreen() {
  const [innovation, setInnovation] = useState(null);
  const [upiId, setUpiId] = useState('');
  const route = useRoute();

  const { innovation: passedInnovation } = route.params; // Get innovation from the previous screen

  useEffect(() => {
    // Fetch the UPI ID and product details based on the product ID
    const fetchInnovationDetails = async () => {
      try {
        const response = await fetch(`http://192.168.157.51:5000/api/innovation/${passedInnovation._id}`);
        const data = await response.json();
        if (response.ok) {
          setUpiId(data.upiId);
          setInnovation({ ...passedInnovation, ...data });
        } else {
          Alert.alert('Error', 'Unable to fetch innovation details');
        }
      } catch (error) {
        console.error('Error fetching innovation details', error);
        Alert.alert('Error', 'Something went wrong');
      }
    };

    fetchInnovationDetails();
  }, [passedInnovation._id]);

  const handlePayment = () => {
    if (!upiId) {
      Alert.alert('Error', 'UPI ID not found');
      return;
    }

    // Here you can initiate UPI payment flow with the fetched UPI ID
    // Note: React Native doesn’t have direct support for UPI payments, so you might need to integrate UPI payment libraries
    Alert.alert(
      'Proceed to Payment',
      `Please send ₹${innovation.cost} to UPI ID: ${upiId}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Handle any post-payment logic here, like updating the user order status
            Alert.alert('Success', 'Payment has been successfully made');
          },
        },
        {
          text: 'Cancel',
          onPress: () => {
            Alert.alert('Cancelled', 'Payment process was cancelled');
          },
        },
      ]
    );
  };

  if (!innovation) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{innovation.productName}</Text>
      <Text style={styles.detailText}>Cost: ₹{innovation.cost}</Text>
      <Text style={styles.detailText}>Rating: {innovation.rating}</Text>
      <Text style={styles.detailText}>Description: {innovation.description}</Text>
      <Text style={styles.detailText}>UPI ID: {upiId}</Text>

      <Button title="Buy" onPress={handlePayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

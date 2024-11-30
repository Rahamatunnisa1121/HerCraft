import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.6.51:5000/api';

export default function YourOrdersScreen() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/purchases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);  // Assuming the response includes address and contact fields
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      Alert.alert('Error', 'Could not load orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {orders.map((order) => (
          <View key={order._id} style={styles.orderContainer}>
            <Text style={styles.orderName}>{order.productName}</Text>
            <Text style={styles.orderCost}>Cost: {order.cost}</Text>
            <Text style={styles.orderDate}>
              Purchased on: {new Date(order.purchaseDate).toLocaleString()}
            </Text>

            {/* Display Address and Contact from the populated Innovation */}
            {order.productId && order.productId.address && (
              <>
                <Text style={styles.orderAddress}>
                  Address: {order.productId.address.street}, {order.productId.address.city}, {order.productId.address.state}, {order.productId.address.zipCode}, {order.productId.address.country}
                </Text>
              </>
            )}
            {order.productId && order.productId.contact && (
              <Text style={styles.orderContact}>Contact: {order.productId.contact.phone}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  scrollContainer: { flexGrow: 1 },
  orderContainer: { marginBottom: 20, borderWidth: 1, padding: 15, borderRadius: 10, borderColor: '#ddd' },
  orderName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  orderCost: { fontSize: 16, color: 'green', marginBottom: 5 },
  orderDate: { fontSize: 14, color: '#555' },
  orderAddress: { fontSize: 14, color: '#555', marginTop: 5 },
  orderContact: { fontSize: 14, color: '#555', marginTop: 5 },
});

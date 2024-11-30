import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from 'react-native';

const Dass1 = () => {
  const [innovations, setInnovations] = useState([]);
  const [totalInnovations, setTotalInnovations] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editInnovation, setEditInnovation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const fetchInnovations = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://192.168.6.51:5000/api/innovations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setInnovations(data);
        setTotalInnovations(data.length);

        const total = data.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
        setTotalEarned(total);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching innovations:', err);
        setError('Failed to fetch innovations');
        setLoading(false);
      }
    };

    fetchInnovations();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdateInnovation = async () => {
    if (!formData.name || !formData.cost || !formData.description || !formData.image) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `http://192.168.6.51:5000/api/innovations/${editInnovation._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setInnovations((prev) =>
          prev.map((item) => (item._id === editInnovation._id ? response.data : item))
        );
        Alert.alert('Success', 'Innovation updated successfully');
        setEditInnovation(null);
        setFormData({ name: '', cost: '', description: '', image: '' });
      }
    } catch (err) {
      console.error('Error updating innovation:', err);
      Alert.alert('Error', 'Could not update innovation');
    }
  };

  const handleEditInnovation = (innovation) => {
    setEditInnovation(innovation);
    setFormData({
      name: innovation.name,
      cost: innovation.cost,
      description: innovation.description,
      image: innovation.image,
    });
  };

  const handleDeleteInnovation = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`http://192.168.6.51:5000/api/innovations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setInnovations((prev) => prev.filter((item) => item._id !== id));
        Alert.alert('Success', 'Innovation deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting innovation:', err);
      Alert.alert('Error', 'Could not delete innovation');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Innovations Dashboard</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Total Innovations: {totalInnovations}</Text>
        <Text style={styles.summaryText}>Total Earnings: ₹{totalEarned.toFixed(2)}</Text>
      </View>
      {innovations.map((item) => (
        <View key={item._id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardText}>Cost: ₹{item.cost}</Text>
            <Text style={styles.cardText}>Total Sold: {parseInt(item.totalSold || 0, 10)}</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={() => handleEditInnovation(item)}
                style={styles.editButton}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteInnovation(item._id)}
                style={styles.deleteButton}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      {editInnovation && (
        <View style={styles.editForm}>
          <Text style={styles.editFormTitle}>Edit Innovation</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => handleFormChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost"
            value={formData.cost}
            onChangeText={(text) => handleFormChange('cost', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => handleFormChange('description', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={formData.image}
            onChangeText={(text) => handleFormChange('image', text)}
          />
          <TouchableOpacity onPress={handleUpdateInnovation} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};




const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f4f4' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  summaryContainer: { marginBottom: 20 },
  summaryText: { fontSize: 16, fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 20, borderRadius: 8, padding: 10, elevation: 4 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDescription: { fontSize: 14, color: '#666', marginVertical: 4 },
  cardText: { fontSize: 14, color: '#333' },
  buttonGroup: { flexDirection: 'row', marginTop: 10 },
  editButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 4, marginRight: 5 },
  deleteButton: { backgroundColor: '#E44E41', padding: 8, borderRadius: 4 },
  buttonText: { color: '#fff', textAlign: 'center' },
  editForm: { backgroundColor: '#fff', padding: 15, borderRadius: 8 },
  editFormTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 10, borderRadius: 5 },
  saveButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center' },
});

export default Dass1;

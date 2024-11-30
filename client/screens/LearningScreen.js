import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LearningScreen = () => {
  const [learningContent, setLearningContent] = useState([]);
  const [newContent, setNewContent] = useState({ title: '', content: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch stored content from AsyncStorage or backend
  useEffect(() => {
    const fetchLearningContent = async () => {
      try {
        const storedContent = await AsyncStorage.getItem('learningContent');
        if (storedContent) {
          setLearningContent(JSON.parse(storedContent));
        } else {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch('http://192.168.157.51:5000/api/learningContent', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          setLearningContent(data);
          // Store the fetched content in AsyncStorage for persistence
          await AsyncStorage.setItem('learningContent', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching learning content:', error);
      }
    };

    fetchLearningContent();
  }, []);

  // Handle adding new content
  const handleAddContent = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.157.51:5000/api/learningContent/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContent),
      });

      if (response.ok) {
        const addedContent = await response.json();
        console.log('Added Content:', addedContent);  // Log response to debug

        // Update state with the new content
        setLearningContent(prevContent => {
          const updatedContent = [...prevContent, addedContent];
          // Update AsyncStorage with the new content
          AsyncStorage.setItem('learningContent', JSON.stringify(updatedContent));
          return updatedContent;
        });

        // Clear the input fields
        setNewContent({ title: '', content: '' });
      } else {
        const errorData = await response.json();  // Log error response from server
        console.error('Error adding learning content:', errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error adding learning content:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Learning Resources</Text>
      <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)} style={styles.addButton}>
        <Text style={styles.addButtonText}>{showAddForm ? 'Close' : 'Add New Resource'}</Text>
      </TouchableOpacity>

      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Add a New Learning Trick</Text>
          <TextInput
            placeholder="Enter Title"
            value={newContent.title}
            onChangeText={(text) => setNewContent({ ...newContent, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter content link"
            value={newContent.content}
            onChangeText={(text) => setNewContent({ ...newContent, content: text })}
            style={styles.input}
          />
          <Button title="Submit" onPress={handleAddContent} color="#6200ea" />
        </View>
      )}

      <ScrollView style={styles.contentList}>
        {learningContent.map((item, index) => (
          <View key={index} style={styles.contentItem}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.content)}>
              <Text style={styles.contentLink}>{item.content}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f6', // Soft pastel background
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8e44ad', // Purple color for a soft yet elegant feel
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#e91e63', // Pink button for a modern look
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#fbe9e7', // Light peach color
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  formLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8e44ad',
    marginBottom: 10,
    fontFamily: 'sans-serif',
  },
  input: {
    height: 45,
    borderColor: '#6200ea',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  contentList: {
    marginTop: 10,
  },
  contentItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'sans-serif',
  },
  contentLink: {
    color: '#FF1493', // Bright pink link color for visibility
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default LearningScreen;

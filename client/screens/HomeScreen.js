import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const scrollViewRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const showButton = currentOffset > 100; // Show button after scrolling 100px
    setShowScrollButton(showButton);
  };

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.authButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>Welcome to HerCraft</Text>
        
        <View style={styles.featuresContainer}>
          {/* Marketplace Link */}
          <TouchableOpacity onPress={() => navigation.navigate('Market')} style={styles.feature}>
            <Ionicons name="basket-outline" size={50} color="#4a90e2" />
            <Text style={styles.featureText}>Marketplace</Text>
          </TouchableOpacity>

          {/* Community Link */}
          <TouchableOpacity onPress={() => navigation.navigate('Community')} style={styles.feature}>
            <Ionicons name="people-outline" size={50} color="#4a90e2" />
            <Text style={styles.featureText}>Community</Text>
          </TouchableOpacity>

          {/* Learning Link */}
          <TouchableOpacity onPress={() => navigation.navigate('Learning')} style={styles.feature}>
            <Ionicons name="book-outline" size={50} color="#4a90e2" />
            <Text style={styles.featureText}>Learning</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          HerCraft is your gateway to a thriving community where creativity meets commerce. Explore our marketplace to find unique products, connect with fellow creators and enthusiasts, and access a wealth of resources to enhance your skills. Join us to embark on a journey of growth, learning, and connection, and discover the potential of your craft in a supportive environment.
        </Text>
        
        <Text style={styles.subDescription}>
          By becoming a part of HerCraft, you'll gain access to:
        </Text>
        <Text style={styles.bulletPoint}>🌟 Exclusive marketplace deals</Text>
        <Text style={styles.bulletPoint}>🌟 Networking opportunities with like-minded individuals</Text>
        <Text style={styles.bulletPoint}>🌟 Learning resources tailored to your interests</Text>
        <Text style={styles.bulletPoint}>🌟 A supportive community that nurtures your creativity</Text>
      </ScrollView>

      {showScrollButton && (
        <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
          <Ionicons name="arrow-up-outline" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
    padding: 10,
    backgroundColor: '#4a90e2',
  },
  settingsButton: {
    marginLeft: 'auto',
  },
  authButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  featuresContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
  },
  feature: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    elevation: 3,
  },
  featureText: {
    marginTop: 5,
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  subDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  bulletPoint: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    backgroundColor: '#4a90e2',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

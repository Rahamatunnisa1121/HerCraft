// client/screens/LoadingScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
  const [loadingPercent, setLoadingPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 50); // Adjust speed of loading

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to HerCraft</Text>
      <View style={styles.loaderContainer}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
        <Text style={styles.loadingText}>{`${loadingPercent}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff6f91', // Base background color
    // Gradient background using linear gradient approach
    // Uncomment below if using expo-linear-gradient
    // background: 'linear-gradient(180deg, #ff6f91, #ffcc70)',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loader: {
    width: 120, // Full circle size
    height: 120, // Full circle size
    borderRadius: 60, // Half of width and height for full circle
    backgroundColor: 'transparent', // No background for loader
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ffcc70', // Light color for border
    borderWidth: 10,
    position: 'relative',
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff', // White text for loading percentage
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30, // Space between welcome text and loader
    color: '#ffffff', // White color for welcome text
    textAlign: 'center',
    textShadowColor: '#ffcc70',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
});

export default LoadingScreen;

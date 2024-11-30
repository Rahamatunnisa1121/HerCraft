import React, { useEffect, useState } from 'react';  
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './client/screens/LoadingScreen';
import HomeScreen from './client/screens/HomeScreen';
import SignupScreen from './client/screens/SignupScreen';
import LoginScreen from './client/screens/LoginScreen';
import ProfileScreen from './client/screens/ProfileScreen';
import MarketScreen from './client/screens/MarketScreen';
import SettingsScreen from './client/screens/SettingsScreen';
import ItemDetail from './client/screens/ItemDetail';
import EditProfile from './client/screens/EditProfile';
import ChangePassword from './client/screens/ChangePassword';
import LearningScreen from './client/screens/LearningScreen';
import Dass from './client/screens/Dass';
import Dass1 from './client/screens/Dass1';
import YourOrders from './client/screens/YourOrders';

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);

      // Load dark mode preference from AsyncStorage
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      setDarkModeEnabled(storedDarkMode === 'true');

      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Profile">
              {(props) => (
                <ProfileScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Market">
              {(props) => (
                <MarketScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="ItemDetail">
              {(props) => (
                <ItemDetail {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Learning">
              {(props) => (
                <LearningScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Dass">
              {(props) => <Dass {...props} darkModeEnabled={darkModeEnabled} />}
            </Stack.Screen>
            <Stack.Screen name="Dass1">
              {(props) => (
                <Dass1 {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Orders">
              {(props) => (
                <YourOrders {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {(props) => (
                <SignupScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Settings">
              {(props) => (
                <SettingsScreen
                  {...props}
                  darkModeEnabled={darkModeEnabled}
                  toggleDarkMode={toggleDarkMode}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Market">
              {(props) => (
                <MarketScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="EditProfile">
              {(props) => (
                <EditProfile {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="ChangePassword">
              {(props) => (
                <ChangePassword {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Learning">
              {(props) => (
                <LearningScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Profile">
              {(props) => (
                <ProfileScreen {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Dass">
              {(props) => <Dass {...props} darkModeEnabled={darkModeEnabled} />}
            </Stack.Screen>
            <Stack.Screen name="Dass1">
              {(props) => (
                <Dass1 {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Orders">
              {(props) => (
                <YourOrders {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
            <Stack.Screen name="ItemDetail">
              {(props) => (
                <ItemDetail {...props} darkModeEnabled={darkModeEnabled} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

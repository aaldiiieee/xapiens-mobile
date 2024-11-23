import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
              await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
            }
  
            // Clear AsyncStorage
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('@user');
  
            router.replace('/login');
          } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };
  

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);

      if (!token) router.replace('/login');
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    SplashScreen.hideAsync();
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={handleLogout}
          >
            <Text style={{ color: Colors[colorScheme ?? 'light'].tint }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'User List',
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="details/[id]"
        options={{
          title: 'User Details',
        }}
      />
    </Stack>
  );
}

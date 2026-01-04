import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1 px-6 justify-center">
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
        <Text className="text-light-300 text-base">Sign in to continue</Text>
      </View>

      <View className="mb-4">
        <Text className="text-white text-sm mb-2">Email</Text>
        <TextInput
          className="bg-dark-100 text-white p-4 rounded-lg border border-dark-200"
          placeholder="Enter your email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-6">
        <Text className="text-white text-sm mb-2">Password</Text>
        <TextInput
          className="bg-dark-100 text-white p-4 rounded-lg border border-dark-200"
          placeholder="Enter your password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="bg-light-200 p-4 rounded-lg mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-primary text-center font-bold text-base">Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text className="text-white text-center">
          Don't have an account? <Text className="text-light-100 font-bold">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
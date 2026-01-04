import { Stack } from "expo-router";
import './global.css';
import { StatusBar, View } from "react-native";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <View className="flex-1 bg-primary" />; // Or a loading screen
  }

  return (
    <Stack>
      <Stack.Screen
            name="(tabs)"
            options={{headerShown: false,}}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{headerShown: false,}}
          />
          <Stack.Screen
            name="(auth)"
            options={{headerShown: false,}}
          />
          <Stack.Screen
            name="(auth)/login"
            options={{headerShown: false,}}
          />
          <Stack.Screen
            name="(auth)/signup"
            options={{headerShown: false,}}
          />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </>
  )
}
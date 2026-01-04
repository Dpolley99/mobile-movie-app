import { icons } from "@/constants/icons";
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSavedMovies } from "@/services/appwrite";
import MovieCard from "@/components/MovieCard";

const Saved = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadSavedMovies = useCallback(async () => {
    if (!isAuthenticated) {
      setMovies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const savedMovies = await getSavedMovies();
      setMovies(savedMovies);
    } catch (error) {
      console.error("Error loading saved movies:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSavedMovies();
  }, [isAuthenticated]);

  // Reload when the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        loadSavedMovies();
      }
    }, [isAuthenticated, loadSavedMovies])
  );

  if (authLoading || loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-16" tintColor="#666" />
          <Text className="text-gray-500 text-lg text-center">
            Please login to save movies
          </Text>
          <TouchableOpacity
            className="bg-secondary px-6 py-3 rounded-lg mt-4"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-primary font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (movies.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-16" tintColor="#666" />
          <Text className="text-gray-500 text-lg text-center">
            No saved movies yet
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-5">
      <View className="py-5">
        <Text className="text-white text-2xl font-bold">Saved Movies</Text>
      </View>
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard 
            {...item} 
            onSaveChange={loadSavedMovies}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default Saved;
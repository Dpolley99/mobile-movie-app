import { icons } from "@/constants/icons";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              // AuthContext now handles errors gracefully, but catch here just in case
              console.error("Unexpected logout error:", error);
            } finally {
              // Navigate to login screen - state is cleared by AuthContext
              router.replace("/(auth)/login");
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.person} className="size-16" tintColor="#666" />
          <Text className="text-gray-500 text-lg text-center">
            Please login to view profile
          </Text>
          <TouchableOpacity
            className="bg-light-200 px-6 py-3 rounded-lg mt-4"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-primary font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Image source={icons.person} className="size-20" tintColor="#fff" />
        <Text className="text-white text-xl font-bold">
          {user?.name || user?.email}
        </Text>
        <Text className="text-light-300 text-base">{user?.email}</Text>
        <TouchableOpacity
          className="bg-red-600 px-6 py-3 rounded-lg mt-4"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
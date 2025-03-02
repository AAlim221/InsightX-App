// components/SocialLogin.tsx
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SocialLogin() {
  const router = useRouter();

  return (
    <>
      <Text className="text-center text-white mb-2">Sign in with</Text>
      <View className="flex-row justify-center mb-4 space-x-6">
        <TouchableOpacity
          className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
          onPress={() => router.push("/HomeScreen")}
        >
          <FontAwesome name="google" size={28} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
          onPress={() => router.push("/HomeScreen")}
        >
          <FontAwesome name="apple" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
          onPress={() => router.push("/HomeScreen")}
        >
          <FontAwesome name="facebook" size={28} color="#1877F2" />
        </TouchableOpacity>
      </View>
    </>
  );
}

// components/SignUpLink.tsx
import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function SignUpLink() {
  return (
    <View className="mt-4">
      <Text className="text-white text-center text-base">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-yellow-300 font-semibold">
          Sign up
        </Link>
      </Text>
    </View>
  );
}

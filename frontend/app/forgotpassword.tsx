import React, { useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";  // Icon library for back arrow

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Top 30% Black Section with Back Button */}
        <View className="flex-[0.3] bg-slate-600 rounded-3xl justify-start items-start p-4 mt-16 mb-4">
          {/* Back Button */}
          <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
            <Link href="/">
              <Ionicons name="arrow-back" size={24} color="white" />
            </Link>
            <Text className="text-white text-lg ml-2">Back</Text>
          </TouchableOpacity>
          <Text className="text-pretty text-justify text-8xl"> Adds here...</Text>
        </View>

        {/* Bottom 70% Purple Form Section */}
        <View className="flex-[0.7] bg-purple-700 p-10 rounded-3xl mb-2">
          <View className="items-center mb-6">
            <Text className="text-white text-3xl font-bold mb-8">Create a new password</Text>
          </View>

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-8"
            value={form.email}
            onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
            keyboardType="email-address"
          />

          {/* Password Input */}
          <TextInput
            placeholder="New Password"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-8"
            secureTextEntry
            value={form.password}
            onChangeText={(password) => setForm((prev) => ({ ...prev, password }))}
            keyboardType="default"
          />

          {/* Confirm Password Input */}
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-8"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(confirmPassword) => setForm((prev) => ({ ...prev, confirmPassword }))}
            keyboardType="default"
          />

          {/* Submit Button */}
          <TouchableOpacity activeOpacity={0.7} className="bg-yellow-400 py-3 rounded-full">
            <Link href="/">
              <Text className="text-center text-black text-lg font-bold">Submit</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

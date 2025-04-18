import React, { useState } from "react";
import axios from "axios";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setMobile] = useState("");
  const [DOB, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!userName || !email || !contactNo || !DOB || !password || !confirmPassword || !role) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      const payload = { userName, email, contactNo, DOB, password, role };

      const { data } = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/register",
        payload
      );

      if (data?.success && data?.user) {
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(data.user));
        Alert.alert("Success", data.message || "Registration successful");
        router.push("/");
      } else {
        Alert.alert("Error", data?.message || "Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Top Section */}
        <View className="bg-slate-500 rounded-3xl h-[20%] px-6 justify-start mt-16 mb-6">
          <TouchableOpacity activeOpacity={0.7} className="mt-8" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-justify text-fuchsia-500 text-6xl p-10">Adds here...</Text>
        </View>

        {/* Form Section */}
        <View className="flex-grow bg-purple-700 p-12 rounded-3xl">
          <View className="items-center mb-6">
            <Text className="text-white text-6xl font-bold">Get started</Text>
            <Text className="text-gray-300 text-base">Create an account to continue!</Text>
          </View>

          <TextInput
            placeholder="UserName"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={userName}
            onChangeText={setUserName}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Mobile no"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={contactNo}
            onChangeText={setMobile}
            keyboardType="number-pad"
          />

          <TextInput
            placeholder="Date of birth"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={DOB}
            onChangeText={setDOB}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-6"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TextInput
            placeholder="Role"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={role}
            onChangeText={setRole}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-yellow-400 py-3 rounded-full"
            onPress={handleSubmit}
          >
            <Text className="text-center text-black text-lg font-bold">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

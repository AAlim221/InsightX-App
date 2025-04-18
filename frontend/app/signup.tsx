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
import { useRouter } from "expo-router"; // Import useRouter
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import storage


export default function Signup() {
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setMobile] = useState("");
  const [DOB, setDOB] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // Fix: boolean state
  const router = useRouter(); // Initialize router

  // Handle Form Submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!userName||!email || !contactNo || !DOB || !password || !confirmPassword || !role) {
        Alert.alert("Error", "Please fill all the fields");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/register",
        { userName,email, contactNo, DOB, password, confirmPassword,role }
      );
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(data.user)); // optional

      alert(data && data.message);
      router.push('/'); 
    } 
    catch (error) {
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
        {/* Top Section (20%) with Back Button */}
        <View className="bg-slate-500 rounded-3xl h-[20%] px-6 justify-start mt-16 mb-6">
          <TouchableOpacity activeOpacity={0.7} className="mt-8" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-justify text-fuchsia-500 text-6xl p-10">Adds here...</Text>
        </View>

        {/* Form Section (70%) */}
        <View className="flex-grow bg-purple-700 p-12 rounded-3xl">
          <View className="items-center mb-6">
            <Text className="text-white text-6xl font-bold">Get started</Text>
            <Text className="text-gray-300 text-base">Create an account to continue!</Text>
          </View>

          {/* userName Input */}
          <TextInput
            placeholder="UserName"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={userName}
            onChangeText={setuserName}
            keyboardType="email-address"
          />
          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={email}
            onChangeText={setEmail}
            keyboardType="default"
          />

          {/* Mobile Number Input */}
          <TextInput
            placeholder="Mobile no"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={contactNo}
            onChangeText={setMobile}
            keyboardType="number-pad"
            inputMode="numeric"
          />

          {/* Date of Birth Input */}
          <TextInput
            placeholder="Date of birth"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={DOB}
            onChangeText={setDOB}
            keyboardType="numeric"
          />

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            keyboardType="default"
          />
          
          {/* Confirm Password Input */}
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-6"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            keyboardType="default"
          />
          {/* Role Input */}
          <TextInput
            placeholder="Role"
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={role}
            onChangeText={setRole}
            keyboardType="default"
          />


          {/* Register Button */}
          <TouchableOpacity activeOpacity={0.7} className="bg-yellow-400 py-3 rounded-full" onPress={handleSubmit}>
            <Text className="text-center text-black text-lg font-bold">
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

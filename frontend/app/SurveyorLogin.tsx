import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import HeroImage from "@/components/HeroImage";
export default function Login() {
  const router = useRouter();

  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!gmail.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter both email and password");
        setLoading(false);
        return;
      }
      
      const { data } = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/surveyorLogin",
        {  gmail, password }
      );
      setLoading(false);
      alert(data && data.message);
      console.log("Login data ==>", { gmail, password });
      router.push("/SurveyorDashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("API error response:", error.response?.data);
        Alert.alert("Error", "Invalid email or password");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black justify-between pt-12 pb-4">
      {/* Hero Image */}
       <HeroImage/>
      {/* Login Form */}
      <View className="bg-purple-700 p-6 rounded-3xl shadow-lg mx-4 flex-1 justify-center">
        {/* Welcome Text */}
        <Text className="text-white text-4xl font-bold text-center mb-8">
          Welcome back!
        </Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 rounded-full mb-4"
          value={gmail}
          onChangeText={setGmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry
          className="h-12 bg-white text-black px-4 rounded-full mb-4"
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password */}
        <Link
          href="/forgotpassword"
          className="text-right text-lg text-pink-400 font-semibold mb-4"
        >
          Forgot password?
        </Link>

        {/* Login Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-yellow-400 py-3 rounded-full mb-4"
          onPress={handleLogin}
        >
          <Text className="text-center text-black text-lg font-bold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

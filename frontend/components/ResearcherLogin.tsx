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
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocialLogin from "./SocialLogin";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter both email and password");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/login",
        { email, password }
      );

      if (data && data.success) {
        Alert.alert("Success", data.message || "Login successful");
        console.log("Login Success Data:", data.user);

        // ✅ Save in correct structure for ProfileCom
        await AsyncStorage.setItem("userData", JSON.stringify({
          _id: data.user._id || "",
          userName: data.user.userName || "",
          email: data.user.email || "",
          contactNo: data.user.contactNo || "",
          DOB: data.user.DOB || "",
          role: data.user.role || "researcher",
          createdAt: data.user.createdAt || new Date().toISOString(),
        }));

        router.push("/HomeScreen");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Login Error:", error.response?.data);
        Alert.alert("Error", "Invalid email or password");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black justify-between">
      <View className="bg-purple-700 p-6 rounded-3xl shadow-lg flex-1 justify-center mt-6 ml-4">
        <View className="items-center mb-8">
          <Text className="text-white text-4xl font-bold text-center">
            Welcome back!
          </Text>
        </View>

        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 rounded-full mb-4"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry
          className="h-12 bg-white text-black px-4 rounded-full mb-4"
          value={password}
          onChangeText={setPassword}
        />

        <Link
          href="/forgotpassword"
          className="text-right text-lg text-pink-400 font-semibold mb-4"
        >
          Forgot password?
        </Link>

        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-yellow-400 py-3 rounded-full mb-4"
          onPress={handleLogin}
        >
          <Text className="text-center text-black text-lg font-bold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <SocialLogin />

        <View className="mt-4">
          <Text className="text-white text-center text-base">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-yellow-300 font-semibold">
              Sign up
            </Link>
          </Text>
          <Text className="text-white text-center text-base">
            Are You Surveyor?{" "}
            <Link href="/SurveyorLogin" className="text-yellow-300 font-semibold">
              Please go to login page
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

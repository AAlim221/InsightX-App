import React, { useState } from "react";
import axios from "axios";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();

  // Define state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login validation
  const handleLogin =async () =>{
    try {
      setLoading(true);
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter both email and password");
        setLoading(false);
        return;
    } 
    
    setLoading(false);
     const { data } = await axios.post(
      "http://192.168.0.197:8082/api/v1/auth/login",
      {email,password}
    );

    alert(data && data.message);
    console.log("Login data==>",{email,password});
    router.push("/HomeScreen"); // Navigate to Home
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      Alert.alert("Error","Invalid email or password");
    } else {
      Alert.alert("Error", "An unexpected error occurred");
    }
    /* console.error(error); */
  } finally {
    setLoading(false);
  }
    //console.log("Logging in with:", form);
    
  };

  return (
    <SafeAreaView className="flex-1 bg-black justify-between pt-12 pb-6 px-6">
      {/* Hero Image */}
      <View className="relative">
        <Image
          source={require("../assets/images/Heroimg.png")} // Ensure path is correct
          className="w-full h-60 rounded-3xl mb-4"
          resizeMode="cover"
        />
      </View>

      {/* Login Form */}
      <View className="bg-purple-700 p-6 mx-none rounded-3xl shadow-lg flex-1 justify-center">
        {/* Welcome Back Text */}
        <View className="items-center mb-8">
          <Text className="text-white text-4xl font-bold text-center">
            Welcome back!
          </Text>
        </View>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 rounded-full mb-4"
          value={email}
          onChangeText={(setEmail)}
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
          onChangeText={(setPassword)}
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
            Login
          </Text>
        </TouchableOpacity>

        {/* Social Login */}
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

        {/* Signup Link */}
        <View className="mt-4">
          <Text className="text-white text-center text-base">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-yellow-300 font-semibold">
              Sign up
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ProfileCom from '@/components/ProfileCom';
import axios from 'axios';

export default function InviteAddScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [nidOrPassport, setNidOrPassport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password || !confirmPassword || !mobileNo || !nidOrPassport) {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      const response = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/register",
        {
          name,
          gmail: email, // send as `gmail` to match backend
          password,
          confirmPassword,
          mobileNo,
          nidOrPassport
        }
      );

      Alert.alert("Success", response.data?.message || "Registered successfully");
      // Optional: Navigate to login
      router.push("/SurveyorLogin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      <View className="flex-1 bg-purple-600 p-4">

        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <ProfileCom />
        </View>

        <Text className="text-black font-bold text-left text-3xl mb-6">Add a Surveyor!</Text>

        {/* Inputs */}
        <TextInput placeholder="UserName" placeholderTextColor="black" className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4" value={name} onChangeText={setName} />
        <TextInput placeholder="Email" placeholderTextColor="black" className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput placeholder="Password" placeholderTextColor="black" secureTextEntry className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4" value={password} onChangeText={setPassword} />
        <TextInput placeholder="Confirm Password" placeholderTextColor="black" secureTextEntry className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4" value={confirmPassword} onChangeText={setConfirmPassword} />
        <TextInput placeholder="Mobile No" placeholderTextColor="black" className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4" value={mobileNo} onChangeText={setMobileNo} keyboardType="number-pad" />
        <TextInput placeholder="NID or Passport" placeholderTextColor="black" className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4" value={nidOrPassport} onChangeText={setNidOrPassport} />

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-lg" onPress={() => {
            setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setMobileNo(""); setNidOrPassport("");
          }}>
            <Text className="text-black font-bold">Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-lg" onPress={handleSubmit}>
            <Text className="text-black font-bold">{loading ? "Loading..." : "Submit"}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Navigation */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-around p-2">
          <TouchableOpacity className="bg-gray-500 p-3 rounded-lg" onPress={() => router.push('/InviteScreen')}>
            <FontAwesome name="users" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-500 p-3 rounded-lg" onPress={() => router.push('/HomeScreen')}>
            <FontAwesome name="home" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-500 p-3 rounded-lg" onPress={() => router.push('/SettingsMenu')}>
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

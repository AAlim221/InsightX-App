// 📁 SurveyorList.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type SurveyorType = {
  _id: string;
  name: string;
  email: string;
};

const SurveyorList = () => {
  const [surveyors, setSurveyors] = useState<SurveyorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://192.168.0.183:8082/api/v1/auth/getAllSurveyors")
      .then((response) => {
        if (response.data.success) {
          setSurveyors(response.data.data);
        } else {
          throw new Error("Failed to fetch surveyors.");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch surveyors:", error);
        Alert.alert("Error", "Could not load surveyor list.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-purple-900">
      <View className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-lg">Surveyor List</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="px-4 bg-purple-700 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center mt-8">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Loading surveyors...</Text>
          </View>
        ) : surveyors.length === 0 ? (
          <Text className="text-white text-center mt-6">
            No surveyors found.
          </Text>
        ) : (
          surveyors.map((surveyor, index) => (
            <View
              key={surveyor._id}
              className="bg-white my-3 p-4 rounded-2xl shadow-md"
            >
              <Text className="text-purple-800 font-bold text-base">
                👤 Name: {surveyor.name}
              </Text>
              <Text className="text-gray-700 mt-1">📧 {surveyor.email}</Text>
              <Text className="text-gray-500 mt-1 text-xs">
                🆔 {surveyor._id}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View className="flex-row bg-purple-800 py-4 justify-around px-8 shadow-inner">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/SettingsMenu")}>
          <Ionicons name="menu" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SurveyorList;

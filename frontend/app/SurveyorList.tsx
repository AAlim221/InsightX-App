import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type SurveyorInfo = {
  _id: string;
  name: string;
  surveyorID: string;
  gmail: string;
  mobileNo: string;
  nidOrPassport: string;
};

const SurveyorList = () => {
  const [surveyors, setSurveyors] = useState<SurveyorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchSurveyors = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://192.168.0.183:8082/api/v1/auth/getAllSurveyors");
      setSurveyors(res.data.data || []);
    } catch (error) {
      console.error("Error fetching surveyors:", error);
      Alert.alert("Error", "Failed to load surveyor list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyors();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View className="bg-purple-600 px-4 py-3 flex-row justify-between items-center shadow">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Surveyor List</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Refresh Button */}
      <TouchableOpacity
        className="bg-purple-200 rounded-full px-3 py-1 self-end mt-2 mr-4"
        onPress={fetchSurveyors}
      >
        <Text className="text-purple-800 font-medium">🔄 Refresh</Text>
      </TouchableOpacity>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6b21a8" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchSurveyors} />
          }
        >
          {surveyors.length === 0 ? (
            <Text className="text-center text-gray-500">No surveyors found.</Text>
          ) : (
            surveyors.map((s) => (
              <View
                key={s._id}
                className="bg-purple-50 border border-purple-200 p-4 rounded-xl mb-3"
              >
                <Text className="font-bold text-lg text-purple-800">👤 {s.name}</Text>
                <Text className="text-gray-700">🪪 ID: {s.surveyorID}</Text>
                <Text className="text-gray-700">📧 Email: {s.gmail}</Text>
                <Text className="text-gray-700">📱 Mobile: {s.mobileNo}</Text>
                <Text className="text-gray-700">🆔 NID/Passport: {s.nidOrPassport}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SurveyorList;

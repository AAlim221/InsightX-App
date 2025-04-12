import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";
import axios from "axios";

// ✅ Define the SurveyorForm type
type SurveyorForm = {
  name: string;
  gmail: string;
  mobileNo: string;
  nidOrPassport: string;
  surveyorID: string;
  formName: string;
  _id: string;
  [key: string]: any; // allows dynamic key access
};

const SurveyorDashboard = () => {
  const [forms, setForms] = useState<SurveyorForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<SurveyorForm | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // 🔄 Fetch surveyor data
  useEffect(() => {
    axios
      .get("http://192.168.0.183:8082/api/v1/auth/surveyors")
      .then((response) => setForms(response.data.data || []))
      .catch((error) => {
        console.error("Error loading forms:", error);
        Alert.alert("Error", "Failed to load forms from the server.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (form: SurveyorForm) => {
    setSelectedForm(form);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedForm(null);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 🔹 Header */}
      <View className="bg-purple-600 flex-row items-center justify-between px-4 py-3 shadow">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Surveyor Dashboard</Text>
        <ProfileCom />
      </View>

      {/* 🔹 Researcher Info */}
      <View className="bg-purple-100 rounded-xl py-3 px-4 m-4 shadow">
        <Text className="text-purple-900 font-bold text-lg">👨 Researcher Name: Alim</Text>
        <Text className="text-purple-700">ID: 123456</Text>
      </View>

      {/* 🔹 Surveyor Form List */}
      <ScrollView className="px-4 flex-1">
        {loading ? (
          <View className="justify-center items-center py-10">
            <ActivityIndicator size="large" color="#6b21a8" />
            <Text className="text-purple-700 mt-2">Loading Templates...</Text>
          </View>
        ) : forms.length === 0 ? (
          <Text className="text-center text-gray-600 mt-10">No templates found.</Text>
        ) : (
          forms.map((form, index) => (
            <View
              key={index}
              className="bg-white border border-purple-300 p-4 rounded-xl my-2 shadow-sm"
            >
              <Text className="text-lg font-semibold text-purple-800">
                📄 {form.formName || `Surveyor ${index + 1}`}
              </Text>
              <Text className="text-sm text-gray-600 mt-1">ID: {form._id}</Text>
              <TouchableOpacity
                className="mt-3 bg-purple-600 px-4 py-2 rounded-full self-start"
                onPress={() => openModal(form)}
              >
                <Text className="text-white font-semibold">View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* 🔹 Modal: Surveyor Details */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60 px-4">
          <View className="bg-white w-full p-0 rounded-2xl max-h-[85%] overflow-hidden">
            {/* Header */}
            <View className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4 flex-row justify-between items-center">
              <Text className="text-white text-lg font-bold">📋 Surveyor Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close-circle" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Details */}
            <ScrollView className="p-5 space-y-4">
              {selectedForm &&
                Object.entries(selectedForm).map(([key, value], idx) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/_/g, " ")
                    .toUpperCase();
                  const iconMap: Record<string, string> = {
                    name: "👤",
                    gmail: "📧",
                    mobileNo: "📱",
                    nidOrPassport: "🆔",
                    surveyorID: "🪪",
                    formName: "📄",
                    _id: "🆔",
                  };
                  const icon = iconMap[key] || "🔸";

                  return (
                    <View
                      key={idx}
                      className="border border-purple-200 bg-purple-50 p-4 rounded-xl shadow-sm"
                    >
                      <Text className="text-xs text-purple-600 uppercase font-medium mb-1 tracking-wide">
                        {icon} {formattedKey}
                      </Text>
                      <Text className="text-gray-800 text-base">
                        {value?.toString() || "N/A"}
                      </Text>
                    </View>
                  );
                })}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              onPress={closeModal}
              className="bg-purple-600 py-3"
            >
              <Text className="text-white text-center text-base font-semibold">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔹 Bottom Navigation */}
      <View className="flex-row bg-purple-600 py-3 justify-between px-8">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/SettingsMenu")}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SurveyorDashboard;

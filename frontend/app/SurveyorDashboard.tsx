import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ SurveyorForm and SurveyorInfo types
type SurveyorForm = {
  name: string;
  gmail: string;
  mobileNo: string;
  nidOrPassport: string;
  surveyorID: string;
  formName: string;
  _id: string;
  [key: string]: any;
};

type SurveyorInfo = {
  name: string;
  surveyorID: string;
  gmail: string;
};

const SurveyorDashboard = () => {
  const [forms, setForms] = useState<SurveyorForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<SurveyorForm | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [surveyorInfo, setSurveyorInfo] = useState<SurveyorInfo | null>(null);

  const [editedName, setEditedName] = useState("");
  const [editedID, setEditedID] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  // 🔄 Load surveyor info and forms
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const info = await AsyncStorage.getItem("surveyorInfo");
          if (info) {
            const parsed = JSON.parse(info) as SurveyorInfo;
            setSurveyorInfo(parsed);
            setEditedName(parsed.name);
            setEditedID(parsed.surveyorID);
          }

          const res = await axios.get("http://192.168.0.183:8082/api/v1/auth/surveyors");
          setForms(res.data.data || []);
        } catch (error) {
          Alert.alert("Error", "Failed to load data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const openModal = (form: SurveyorForm) => {
    setSelectedForm(form);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedForm(null);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    try {
      if (!surveyorInfo?.gmail) return;

      await axios.delete(`http://192.168.0.183:8082/api/v1/auth/deleteSurveyor/${surveyorInfo.gmail}`);
      await AsyncStorage.clear();
      Alert.alert("Deleted", "Your account has been deleted.");
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to delete account.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!surveyorInfo?.gmail) return;

    try {
      const res = await axios.put("http://192.168.0.183:8082/api/v1/auth/updateSurveyor", {
        gmail: surveyorInfo.gmail,
        name: editedName,
        surveyorID: editedID,
        password: editedPassword || undefined,
      });

      Alert.alert("Success", res.data.message || "Profile updated.");
      const updatedUser: SurveyorInfo = {
        name: editedName,
        surveyorID: editedID,
        gmail: surveyorInfo.gmail,
      };
      await AsyncStorage.setItem("surveyorInfo", JSON.stringify(updatedUser));
      setSurveyorInfo(updatedUser);
      setProfileVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 🔹 Header */}
      <View className="bg-purple-600 flex-row items-center justify-between px-4 py-3 shadow">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Surveyor Dashboard</Text>
        <TouchableOpacity onPress={() => setProfileVisible(true)}>
          <FontAwesome name="user-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Surveyor Info */}
      <View className="bg-purple-100 rounded-xl py-3 px-4 m-4 shadow">
        {surveyorInfo ? (
          <>
            <Text className="text-purple-900 font-bold text-lg">👨 Surveyor Name: {surveyorInfo.name}</Text>
            <Text className="text-purple-700">Surveyor ID: {surveyorInfo.surveyorID}</Text>
          </>
        ) : (
          <Text className="text-purple-700">Loading surveyor info...</Text>
        )}
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

      {/* 🔹 Modal: Form Details */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60 px-4">
          <View className="bg-white w-full p-0 rounded-2xl max-h-[85%] overflow-hidden">
            <View className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4 flex-row justify-between items-center">
              <Text className="text-white text-lg font-bold">📋 Surveyor Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close-circle" size={28} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-5 space-y-4">
              {selectedForm &&
                Object.entries(selectedForm).map(([key, value], idx) => {
                  const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toUpperCase();
                  const iconMap: Record<string, string> = {
                    name: "👤", gmail: "📧", mobileNo: "📱", nidOrPassport: "🆔", surveyorID: "🪪", formName: "📄", _id: "🆔"
                  };
                  const icon = iconMap[key] || "🔸";

                  return (
                    <View key={idx} className="border border-purple-200 bg-purple-50 p-4 rounded-xl shadow-sm">
                      <Text className="text-xs text-purple-600 uppercase font-medium mb-1 tracking-wide">
                        {icon} {formattedKey}
                      </Text>
                      <Text className="text-gray-800 text-base">{value?.toString() || "N/A"}</Text>
                    </View>
                  );
                })}
            </ScrollView>

            <TouchableOpacity onPress={closeModal} className="bg-purple-600 py-3">
              <Text className="text-white text-center text-base font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔹 Modal: Profile with Edit/Delete/Logout */}
      <Modal visible={profileVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
          <View className="bg-white rounded-2xl p-6 w-11/12">
            <Text className="text-lg font-bold text-center mb-4">👤 Your Profile</Text>

            <TextInput
              className="bg-gray-100 px-4 py-2 mb-3 rounded-full"
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Name"
            />
            <TextInput
              className="bg-gray-100 px-4 py-2 mb-3 rounded-full"
              value={editedID}
              onChangeText={setEditedID}
              placeholder="Surveyor ID"
            />
            <TextInput
              className="bg-gray-100 px-4 py-2 mb-5 rounded-full"
              secureTextEntry
              value={editedPassword}
              onChangeText={setEditedPassword}
              placeholder="New Password (optional)"
            />

            <TouchableOpacity className="bg-purple-600 p-3 rounded-full mb-3" onPress={handleUpdateProfile}>
              <Text className="text-white text-center font-semibold">Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-500 p-3 rounded-full mb-3" onPress={handleDeleteAccount}>
              <Text className="text-white text-center font-semibold">Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-400 p-3 rounded-full mb-3" onPress={handleLogout}>
              <Text className="text-white text-center font-semibold">Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-2" onPress={() => setProfileVisible(false)}>
              <Text className="text-blue-600 text-center font-semibold">Cancel</Text>
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

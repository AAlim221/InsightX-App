import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";

// Types
type FormType = {
  id?: string;
  title: string;
  [key: string]: any;
};

type UserType = {
  name: string;
  email: string;
  _id: string;
};

const ResearcherDashboard = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    axios
      .get("http://192.168.0.183:8082/api/v1/auth/listAllForms")
      .then((response) => setForms(response.data))
      .catch((error) => {
        console.error("Error loading forms:", error);
        Alert.alert("Error", "Failed to load forms from the server.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBoxPress = (form: FormType) => {
    setSelectedForm(form);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;

    try {
      const response = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/createForm",
        selectedForm,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Form submitted successfully.");
        setModalVisible(false);
      } else {
        Alert.alert(
          "Failed",
          `Server responded with status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error", "Failed to submit the form.");
    }
  };

  const confirmSubmit = () => {
    Alert.alert("Confirm", "Do you want to submit this form?", [
      { text: "Cancel", style: "cancel" },
      { text: "Submit", onPress: handleSubmit },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-900">
      {/* Top Nav */}
      <View className="bg-gradient-to-r from-purple-600 to-indigo-600 flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <ProfileCom />
      </View>

      {/* User Info */}
      <View className="bg-purple-700 py-4 px-6">
        <View className="bg-white rounded-xl mb-4 py-4 shadow-md">
          <Text className="text-center text-black font-semibold text-lg">
            👩‍🔬 Researcher Name: {user?.name || "N/A"}
          </Text>
        </View>
        <View className="bg-white rounded-xl mb-4 py-4 shadow-md">
          <Text className="text-center text-black font-semibold text-lg">
            🆔 Researcher ID: {user?._id || "N/A"}
          </Text>
        </View>
        <TouchableOpacity className="bg-white rounded-xl py-4 shadow-md">
          <Text className="text-center text-black font-semibold text-lg">
            📂 View All Templates
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forms List */}
      <ScrollView className="bg-purple-700 px-4 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center my-8">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Loading forms...</Text>
          </View>
        ) : forms.length === 0 ? (
          <Text className="text-white text-center mt-4">
            No forms available.
          </Text>
        ) : (
          forms.map((form: FormType, index: number) => (
            <TouchableOpacity
              key={form._id || index}
              className="bg-white h-28 my-3 rounded-2xl px-4 py-3 shadow-md flex-row items-center"
              onPress={() => handleBoxPress(form)}
            >
              <Ionicons
                name="document-text-outline"
                size={28}
                color="#6D28D9"
              />
              <Text className="text-black font-semibold text-base ml-4">
                {form.title || `Form ${index + 1}`}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-purple-950 bg-opacity-70 px-4">
          <View className="bg-white p-4 rounded-2xl max-h-[90%] shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <Text className="text-xl font-bold text-purple-700 text-center mb-4">
                {selectedForm?.title || "Form Details"}
              </Text>

              {/* People Info */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  👥 People Information
                </Text>
                {selectedForm?.peopleDetails &&
                  Object.entries(selectedForm.peopleDetails).map(
                    ([key, value], idx) => (
                      <View key={idx} className="mb-2">
                        <Text className="text-sm font-medium text-gray-700 capitalize">
                          {key}
                        </Text>
                        <Text className="bg-gray-100 p-2 rounded-md text-gray-900 text-sm">
                          {String(value)}
                        </Text>
                      </View>
                    )
                  )}
              </View>

              {/* Questions */}
              <View>
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  ❓ Questions
                </Text>
                {selectedForm?.questions &&
                  selectedForm.questions.map((question: any, index: number) => (
                    <View
                      key={index}
                      className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                      <Text className="text-sm font-semibold mb-2 text-purple-700">
                        Question {index + 1}:{" "}
                        {question.question || "No question text"}
                      </Text>

                      {/* Render type-specific UI */}
                      {["multiple-choice", "checkboxes"].includes(
                        question.type
                      ) &&
                        question.options?.map((opt: string, i: number) => (
                          <View key={i} className="flex-row items-center mb-1">
                            <View className="h-4 w-4 mr-2 rounded-full border border-gray-400 bg-white" />
                            <Text className="text-sm text-gray-800">{opt}</Text>
                          </View>
                        ))}

                      {question.type === "short-answer" && (
                        <TextInput
                          placeholder="Short answer text"
                          editable={false}
                          className="border mt-2 border-gray-300 p-2 rounded bg-white text-sm text-gray-700"
                        />
                      )}

                      {["linear-scale", "rating"].includes(question.type) && (
                        <Text className="text-sm text-gray-600 italic mt-1">
                          Scale: {question.minValue} to {question.maxValue}
                        </Text>
                      )}
                    </View>
                  ))}
              </View>

              {/* Modal Buttons */}
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="flex-1 mr-2 bg-green-600 py-3 rounded-lg shadow"
                  onPress={confirmSubmit}
                >
                  <Text className="text-center text-white font-bold">
                    Add Surveyor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 ml-2 bg-red-500 py-3 rounded-lg shadow"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-center text-white font-bold">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
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

export default ResearcherDashboard;

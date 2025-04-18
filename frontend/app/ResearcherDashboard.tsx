import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, ActivityIndicator, TextInput, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";

type FormType = {
  _id?: string;
  title: string;
  surveyName?: string;
  surveyDetails?: string;
  peopleDetails?: { [key: string]: any };
  questions?: any[];
  researcherId?: string;
};

type UserType = {
  _id: string;
  name?: string;
  userName?: string;
  email: string;
};

const ResearcherDashboard = () => {
  const { user: userParam } = useLocalSearchParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [forms, setForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        let parsedUser = null;
        if (userParam) {
          parsedUser = JSON.parse(userParam as string);
          await AsyncStorage.setItem("loggedInUser", JSON.stringify(parsedUser));
        } else {
          const storedUser = await AsyncStorage.getItem("loggedInUser");
          if (storedUser) parsedUser = JSON.parse(storedUser);
        }

        if (parsedUser) {
          console.log("✅ Loaded User:", parsedUser);
          setUser(parsedUser);
        } else {
          Alert.alert("Error", "User not found. Please login again.");
        }
      } catch (error) {
        console.error("❌ Error loading user:", error);
      }
    };

    loadUser();
  }, [userParam]);

  useEffect(() => {
    if (user?._id) {
      console.log("📦 Fetching forms for:", user._id);
      axios
        .get(`http://192.168.0.183:8082/api/v1/auth/byResearcher/${user._id}`)
        .then((response) => {
          console.log("✅ Fetched Forms:", response.data);
          setForms(response.data);
        })
        .catch((error) => {
          console.error("❌ Error fetching forms:", error);
          Alert.alert("Error", "Could not load your forms.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleBoxPress = (form: FormType) => {
    setSelectedForm(form);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-900">
      {/* Header */}
      <View className="bg-gradient-to-r from-purple-600 to-indigo-600 flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-center font-semibold text-lg">Researcher Dashboard</Text>
        <ProfileCom />
      </View>

      {/* Researcher Info */}
      <View className="bg-purple-700 py-4 px-6">
        <View className="bg-white rounded-xl mb-4 py-4 shadow-md">
          <Text className="text-center text-black font-semibold text-lg">
            👩‍🔬 Researcher Name: {user?.name || user?.userName || "N/A"}
          </Text>
        </View>
        <View className="bg-white rounded-xl mb-4 py-4 shadow-md">
          <Text className="text-center text-black font-semibold text-lg">
            🆔 Researcher ID: {user?._id || "N/A"}
          </Text>
        </View>
      </View>

      {/* Forms List */}
      <ScrollView className="bg-purple-700 px-4 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center my-8">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Loading forms...</Text>
          </View>
        ) : forms.length === 0 ? (
          <Text className="text-white text-center mt-4">No forms found.</Text>
        ) : (
          forms.map((form, index) => (
            <TouchableOpacity
              key={form._id || index}
              className="bg-white h-28 my-3 rounded-2xl px-4 py-3 shadow-md flex-row items-center"
              onPress={() => handleBoxPress(form)}
            >
              <Ionicons name="document-text-outline" size={28} color="#6D28D9" />
              <Text className="text-black font-semibold text-base ml-4">
                {form.title || `Form ${index + 1}`}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for Form Preview */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-purple-950 bg-opacity-70 px-4">
          <View className="bg-white p-4 rounded-2xl max-h-[90%] shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-center text-purple-800 text-2xl font-bold mb-4">
                {selectedForm?.title}
              </Text>

              {selectedForm?.surveyName && (
                <Text className="text-center text-purple-600 font-bold mb-2">
                  📝 {selectedForm.surveyName}
                </Text>
              )}

              {selectedForm?.surveyDetails && (
                <Text className="text-center text-gray-500 italic mb-4">
                  {selectedForm.surveyDetails}
                </Text>
              )}

              {selectedForm?.questions?.map((question, index) => (
                <View key={index} className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <Text className="font-semibold text-purple-700 mb-2">
                    Q{index + 1}: {question.question}
                  </Text>

                  {/* Short/Paragraph */}
                  {["short-answer", "paragraph"].includes(question.type) && (
                    <TextInput
                      editable={false}
                      placeholder="Your answer"
                      multiline={question.type === "paragraph"}
                      className="bg-white p-2 rounded border border-gray-300 text-gray-700"
                    />
                  )}

                  {/* Multiple Choice / Checkboxes */}
                  {["multiple-choice", "checkboxes"].includes(question.type) &&
                    question.options?.map((opt: string, i: number) => (
                      <View key={i} className="flex-row items-center mb-1">
                        <Ionicons
                          name={question.type === "checkboxes" ? "checkbox-outline" : "radio-button-off"}
                          size={20}
                          color="#6D28D9"
                        />
                        <Text className="ml-2 text-gray-700">{opt}</Text>
                      </View>
                    ))}

                  {/* Linear Scale */}
                  {question.type === "linear-scale" && (
                    <View className="flex-row space-x-2 mt-2">
                      {Array.from({ length: (question.maxValue || 5) - (question.minValue || 1) + 1 },
                        (_, i) => (question.minValue || 1) + i
                      ).map((val) => (
                        <View key={val} className="h-6 w-6 bg-white border rounded-full items-center justify-center">
                          <Text className="text-xs">{val}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Rating */}
                  {question.type === "rating" && (
                    <View className="flex-row mt-2">
                      {Array.from({ length: question.maxValue || 5 }).map((_, i) => (
                        <Text key={i} className="text-yellow-500 text-xl">⭐</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {/* Buttons */}
              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/SurveyorRegister",
                      params: { formId: selectedForm?._id },
                    })
                  }
                  className="flex-1 bg-green-600 py-3 rounded-lg mr-2"
                >
                  <Text className="text-center text-white font-bold">Add Surveyor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="flex-1 bg-red-500 py-3 rounded-lg ml-2"
                >
                  <Text className="text-center text-white font-bold">Close</Text>
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

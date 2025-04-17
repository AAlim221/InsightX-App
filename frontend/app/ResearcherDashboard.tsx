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
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";

type FormType = {
  id?: string;
  title: string;
  surveyName?: string;
  surveyDetails?: string;
  peopleDetails?: { [key: string]: any };
  questions?: any[];
  _id?: string;
};

type UserType = {
  name: string;
  email: string;
  _id: string;
};

const ResearcherDashboard = () => {
  const { user: userParam } = useLocalSearchParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [forms, setForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userParam) {
      try {
        const parsedUser = JSON.parse(userParam as string);  // Parsing user data
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      }
    }
  }, [userParam]);

  useEffect(() => {
    axios
      .get("http://172.20.93.54:8082/api/v1/auth/listAllForms")
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

  return (
    <SafeAreaView className="flex-1 bg-purple-900">
      <View className="bg-gradient-to-r from-purple-600 to-indigo-600 flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-center font-semibold text-lg">Researcher Dashboard</Text>
        <ProfileCom />
      </View>

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
      </View>

      <ScrollView className="bg-purple-700 px-4 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center my-8">
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white mt-4">Loading forms...</Text>
          </View>
        ) : forms.length === 0 ? (
          <Text className="text-white text-center mt-4">No forms available.</Text>
        ) : (
          forms.map((form: FormType, index: number) => (
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

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-purple-950 bg-opacity-70 px-4">
          <View className="bg-white p-4 rounded-2xl max-h-[90%] shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4 bg-white border border-purple-300 rounded-xl p-4 shadow">
                <Text className="text-center text-purple-800 text-2xl font-bold">
                  {selectedForm?.title || "Untitled Form"}
                </Text>
              </View>
              {selectedForm?.surveyName && (
                <View className="mb-2 bg-purple-100 border border-purple-300 rounded-xl p-3">
                  <Text className="text-center text-purple-700 text-base font-semibold">
                    📝 {selectedForm.surveyName}
                  </Text>
                </View>
              )}
              {selectedForm?.surveyDetails && (
                <View className="mb-4 bg-gray-100 border border-gray-300 rounded-xl p-3">
                  <Text className="text-center text-gray-600 italic">
                    {selectedForm.surveyDetails}
                  </Text>
                </View>
              )}

              {selectedForm?.questions?.map((question: any, index: number) => (
                <View
                  key={index}
                  className="mb-5 border border-gray-200 rounded-xl bg-gray-50 p-4"
                >
                  <Text className="font-semibold text-purple-700 mb-2">
                    Q{index + 1}: {question.question}
                  </Text>

                  {["short-answer", "paragraph"].includes(question.type) && (
                    <TextInput
                      placeholder="Your response"
                      multiline={question.type === "paragraph"}
                      editable={false}
                      className="border border-gray-300 bg-white p-2 rounded-md text-sm text-gray-600"
                    />
                  )}

                  {["multiple-choice", "checkboxes"].includes(question.type) &&
                    question.options?.map((opt: string, i: number) => (
                      <View key={i} className="flex-row items-center mb-2">
                        <View
                          className={`h-4 w-4 mr-2 ${
                            question.type === "checkboxes"
                              ? "border border-gray-700 bg-white"
                              : "rounded-full border-2 border-purple-600"
                          }`}
                        />
                        <Text className="text-gray-700 text-sm">{opt}</Text>
                      </View>
                    ))}

                  {question.type === "linear-scale" && (
                    <View className="flex-row mt-2 space-x-2">
                      {Array.from(
                        {
                          length:
                            (question.maxValue || 5) -
                              (question.minValue || 1) +
                            1,
                        },
                        (_: any, i: number) => i + (question.minValue || 1)
                      ).map((val: number) => (
                        <View
                          key={val}
                          className="h-6 w-6 rounded-full border border-gray-500 bg-white items-center justify-center"
                        >
                          <Text className="text-xs text-center text-gray-700">
                            {val}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {question.type === "rating" && (
                    <View className="flex-row mt-2 space-x-1">
                      {Array.from(
                        { length: question.maxValue || 5 },
                        (_: any, i: number) => i
                      ).map((i: number) => (
                        <Text key={i} className="text-yellow-500 text-xl">
                          ⭐
                        </Text>
                      ))}
                    </View>
                  )}

                  {["multiple-choice-grid", "checkbox-grid"].includes(
                    question.type
                  ) &&
                    question.rows?.length > 0 &&
                    question.columns?.length > 0 && (
                      <View className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                        <View className="flex-row bg-gray-200">
                          <View className="w-32 p-2 border-r border-gray-300" />
                          {question.columns.map((col: string, ci: number) => (
                            <View
                              key={ci}
                              className="flex-1 p-2 border-l border-gray-300 items-center"
                            >
                              <Text className="font-bold text-xs text-center">
                                {col}
                              </Text>
                            </View>
                          ))}
                        </View>

                        {question.rows.map((row: string, ri: number) => (
                          <View
                            key={ri}
                            className="flex-row bg-white border-t border-gray-300"
                          >
                            <View className="w-32 p-2 border-r border-gray-300">
                              <Text className="text-sm text-gray-800">{row}</Text>
                            </View>
                            {question.columns.map((_: any, ci: number) => (
                              <View
                                key={ci}
                                className="flex-1 items-center justify-center border-l border-gray-300 p-2"
                              >
                                <View
                                  className={`h-4 w-4 ${
                                    question.type === "checkbox-grid"
                                      ? "border border-gray-700 bg-white"
                                      : "rounded-full border-2 border-purple-600"
                                  }`}
                                />
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    )}
                </View>
              ))}

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="flex-1 mr-2 bg-green-600 py-3 rounded-lg shadow"
                  onPress={() =>
                    router.push({
                      pathname: "/SurveyorRegister",
                      params: { formId: selectedForm?._id },
                    })
                  }
                >
                  <Text className="text-center text-white font-bold">
                    Add Surveyor
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 ml-2 bg-red-500 py-3 rounded-lg shadow"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-center text-white font-bold">Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
// =======================
// File: frontend/screens/ResponseQuestion.tsx
// =======================

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
  _id?: string;
  title: string;
  questions: any[];
  peopleDetails?: any;
};

type UserType = {
  name: string;
  email: string;
  _id: string;
};

const ResponseQuestion = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

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
    setAnswers({});
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;

    const payload = {
      formId: selectedForm._id,
      respondentDetails: user || {},
      answers: Object.entries(answers).map(([index, response]) => {
        const q = selectedForm.questions[+index];
        return {
          question: q.question,
          type: q.type,
          response,
        };
      }),
    };

    try {
      const response = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/submit",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Form submitted successfully.");
        setModalVisible(false);
      } else {
        Alert.alert("Failed", `Server responded with status: ${response.status}`);
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
      <View className="bg-purple-700 px-4 ">
        <Text className="bg-white p-4 rounded-2xl max-h-[90%] shadow-lg mb-4">Surveyor Name:Alim</Text>
        <Text className="bg-white p-4 rounded-2xl max-h-[90%] shadow-lg">Surveyor Id:21</Text>
      </View>

      {/* Forms List */}
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
              <Text className="text-xl font-bold text-purple-700 text-center mb-4">
                {selectedForm?.title || "Form Details"}
              </Text>

              {selectedForm?.questions?.map((q, idx) => (
                <View key={idx} className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Text className="text-sm font-semibold mb-2 text-purple-700">
                    Question {idx + 1}: {q.question}
                  </Text>

                  {q.type === "short-answer" && (
                    <TextInput
                      placeholder="Your answer"
                      value={answers[idx] || ""}
                      onChangeText={(text) =>
                        setAnswers((prev) => ({ ...prev, [idx]: text }))
                      }
                      className="border mt-2 border-gray-300 p-2 rounded bg-white text-sm text-gray-700"
                    />
                  )}

                  {q.type === "paragraph" && (
                    <TextInput
                      placeholder="Write your detailed answer"
                      value={answers[idx] || ""}
                      multiline
                      numberOfLines={4}
                      onChangeText={(text) => setAnswers((prev) => ({ ...prev, [idx]: text }))}
                      className="border mt-2 border-gray-300 p-2 rounded bg-white text-sm text-gray-700 h-24"
                    />
                  )}

                  {q.type === "multiple-choice" &&
                    q.options?.map((opt: string, i: number) => (
                      <TouchableOpacity
                        key={i}
                        className="flex-row items-center mb-2"
                        onPress={() => setAnswers((prev) => ({ ...prev, [idx]: opt }))}
                      >
                        <Ionicons
                          name={answers[idx] === opt ? "radio-button-on" : "radio-button-off"}
                          size={20}
                          color="#6D28D9"
                        />
                        <Text className="ml-2 text-sm text-gray-800">{opt}</Text>
                      </TouchableOpacity>
                    ))}

                  {q.type === "checkboxes" &&
                    q.options?.map((opt: string, i: number) => {
                      const checked = answers[idx]?.includes(opt);
                      return (
                        <TouchableOpacity
                          key={i}
                          className="flex-row items-center mb-2"
                          onPress={() => {
                            const current = answers[idx] || [];
                            const updated = checked
                              ? current.filter((item: string) => item !== opt)
                              : [...current, opt];
                            setAnswers((prev) => ({ ...prev, [idx]: updated }));
                          }}
                        >
                          <Ionicons
                            name={checked ? "checkbox" : "square-outline"}
                            size={20}
                            color="#6D28D9"
                          />
                          <Text className="ml-2 text-sm text-gray-800">{opt}</Text>
                        </TouchableOpacity>
                      );
                    })}

                  {q.type === "linear-scale" && (
                    <View className="flex-row items-center justify-between mt-2 px-1">
                      {[...Array(5)].map((_, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => setAnswers((prev) => ({ ...prev, [idx]: i + 1 }))}
                        >
                          <Text
                            className={`text-sm ${
                              answers[idx] === i + 1 ? "text-purple-700 font-bold" : "text-gray-600"
                            }`}
                          >
                            {i + 1}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {q.type === "rating" && (
                    <View className="flex-row items-center mt-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <TouchableOpacity
                          key={num}
                          onPress={() => setAnswers((prev) => ({ ...prev, [idx]: num }))}
                        >
                          <Ionicons
                            name={answers[idx] >= num ? "star" : "star-outline"}
                            size={24}
                            color="#FACC15"
                            className="mx-1"
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {q.type === "multiple-choice-grid" && (
                    <View className="border mt-2 rounded p-2">
                      {q.rows?.map((row: string, rowIdx: number) => (
                        <View key={rowIdx} className="mb-2">
                          <Text className="text-sm font-semibold text-gray-700 mb-1">{row}</Text>
                          <View className="flex-row flex-wrap gap-2">
                            {q.columns?.map((col: string, colIdx: number) => (
                              <TouchableOpacity
                                key={colIdx}
                                className="flex-row items-center mr-4"
                                onPress={() => {
                                  const current = answers[idx] || {};
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [idx]: { ...current, [row]: col },
                                  }));
                                }}
                              >
                                <Ionicons
                                  name={
                                    answers[idx]?.[row] === col
                                      ? "radio-button-on"
                                      : "radio-button-off"
                                  }
                                  size={20}
                                  color="#6D28D9"
                                />
                                <Text className="ml-1 text-sm text-gray-700">{col}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {q.type === "checkbox-grid" && (
                    <View className="border mt-2 rounded p-2">
                      {q.rows?.map((row: string, rowIdx: number) => (
                        <View key={rowIdx} className="mb-2">
                          <Text className="text-sm font-semibold text-gray-700 mb-1">{row}</Text>
                          <View className="flex-row flex-wrap gap-2">
                            {q.columns?.map((col: string, colIdx: number) => {
                              const checked = answers[idx]?.[row]?.includes(col);
                              return (
                                <TouchableOpacity
                                  key={colIdx}
                                  className="flex-row items-center mr-4"
                                  onPress={() => {
                                    const current = answers[idx]?.[row] || [];
                                    const updated = checked
                                      ? current.filter((c: string) => c !== col)
                                      : [...current, col];
                                    setAnswers((prev) => ({
                                      ...prev,
                                      [idx]: { ...(prev[idx] || {}), [row]: updated },
                                    }));
                                  }}
                                >
                                  <Ionicons
                                    name={checked ? "checkbox" : "square-outline"}
                                    size={20}
                                    color="#6D28D9"
                                  />
                                  <Text className="ml-1 text-sm text-gray-700">{col}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="flex-1 mr-2 bg-green-600 py-3 rounded-lg shadow"
                  onPress={confirmSubmit}
                >
                  <Text className="text-center text-white font-bold">Submit</Text>
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

export default ResponseQuestion;

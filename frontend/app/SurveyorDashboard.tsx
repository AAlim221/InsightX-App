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

// Define missing types
type SurveyorForm = {
  name: string;
  gmail: string;
  mobileNo: string;
  nidOrPassport: string;
  surveyorID: string;
  formName: string;
  title: string;
  questions: any[];
  _id: string;
  [key: string]: any;
};

type FormType = {
  _id?: string;
  title: string;
  questions: any[];
  peopleDetails?: any;
};

const SurveyorDashboard = () => {
  const [forms, setForms] = useState<SurveyorForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [surveyorInfo, setSurveyorInfo] = useState<{ name: string; surveyorID: string } | null>(null);

  // Load surveyor data and forms
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // Fetch surveyor information
          const info = await AsyncStorage.getItem("surveyorInfo");
          if (info) {
            const parsed = JSON.parse(info);
            setSurveyorInfo(parsed);
          }

          const res = await axios.get("http://192.168.0.183:8082/api/v1/auth/listAllForms");
          if (res.data && Array.isArray(res.data)) {
            setForms(res.data);
          } else {
            setForms([]);
          }
        } catch (error) {
          Alert.alert("Error", "Failed to load data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  // Handle box press to open the modal
  const handleBoxPress = (form: FormType) => {
    setSelectedForm(form);
    setAnswers({});
    setModalVisible(true);
  };

  // Handle form submission
  const confirmSubmit = async () => {
    if (!selectedForm) return;

    const payload = {
      formId: selectedForm._id,
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
        { headers: { "Content-Type": "application/json" } }
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-purple-600 flex-row items-center justify-between px-4 py-3 shadow-lg">
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">Surveyor Dashboard</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome name="user-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Surveyor Info Section */}
      {surveyorInfo && (
        <View className="bg-purple-100 rounded-xl py-3 px-4 m-4 shadow-lg">
          <Text className="text-purple-900 font-bold text-lg text-center">👨 Surveyor Name: {surveyorInfo.name}</Text>
          <Text className="text-purple-700 font-bold text-lg text-center">🪪 Surveyor ID: {surveyorInfo.surveyorID}</Text>
        </View>
      )}

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

      {/* Modal for Form Submission */}
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

                  {q.type === "checkbox" &&
                    q.options?.map((opt: string, i: number) => (
                      <TouchableOpacity
                        key={i}
                        className="flex-row items-center mb-2"
                        onPress={() =>
                          setAnswers((prev) => {
                            const newAnswers = { ...prev };
                            if (newAnswers[idx]) {
                              newAnswers[idx] = newAnswers[idx].includes(opt)
                                ? newAnswers[idx].filter((item: string) => item !== opt)
                                : [...newAnswers[idx], opt];
                            } else {
                              newAnswers[idx] = [opt];
                            }
                            return newAnswers;
                          })
                        }
                      >
                        <Ionicons
                          name={
                            answers[idx]?.includes(opt) ? "checkbox" : "square-outline"
                          }
                          size={20}
                          color="#6D28D9"
                        />
                        <Text className="ml-2 text-sm text-gray-800">{opt}</Text>
                      </TouchableOpacity>
                    ))}

                  {q.type === "checkbox-grid" && (
                    <View>
                      {q.rows?.map((row: string, rowIndex: number) => (
                        <View key={rowIndex} className="flex-row justify-between">
                          <Text className="text-sm text-gray-800">{row}</Text>
                          {q.columns?.map((col: string, colIndex: number) => (
                            <TouchableOpacity
                              key={colIndex}
                              className="flex-row items-center"
                              onPress={() => {
                                setAnswers((prev) => {
                                  const newAnswers = { ...prev };
                                  const answerKey = `${idx}-${rowIndex}-${colIndex}`;
                                  if (newAnswers[answerKey]) {
                                    newAnswers[answerKey] = false;
                                  } else {
                                    newAnswers[answerKey] = true;
                                  }
                                  return newAnswers;
                                });
                              }}
                            >
                              <Ionicons
                                name={answers[`${idx}-${rowIndex}-${colIndex}`] ? "checkbox" : "square-outline"}
                                size={20}
                                color="#6D28D9"
                              />
                              <Text className="ml-2 text-sm text-gray-800">{col}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}

                  {q.type === "multiple-choice-grid" && (
                    <View>
                      {q.rows?.map((row: string, rowIndex: number) => (
                        <View key={rowIndex} className="flex-row justify-between">
                          <Text className="text-sm text-gray-800">{row}</Text>
                          {q.columns?.map((col: string, colIndex: number) => (
                            <TouchableOpacity
                              key={colIndex}
                              className="flex-row items-center"
                              onPress={() => {
                                setAnswers((prev) => {
                                  const newAnswers = { ...prev };
                                  const answerKey = `${idx}-${rowIndex}-${colIndex}`;
                                  newAnswers[answerKey] = col;
                                  return newAnswers;
                                });
                              }}
                            >
                              <Ionicons
                                name={
                                  answers[`${idx}-${rowIndex}-${colIndex}`] === col
                                    ? "radio-button-on"
                                    : "radio-button-off"
                                }
                                size={20}
                                color="#6D28D9"
                              />
                              <Text className="ml-2 text-sm text-gray-800">{col}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
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
    </SafeAreaView>
  );
};

export default SurveyorDashboard;

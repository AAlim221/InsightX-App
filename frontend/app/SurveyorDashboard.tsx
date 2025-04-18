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
  surveyName?: string;
  surveyDetails?: string;
};

const SurveyorDashboard = () => {
  const [forms, setForms] = useState<SurveyorForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [surveyorInfo, setSurveyorInfo] = useState<{
    name: string;
    surveyorID: string;
    gmail: string;
  } | null>(null);

  const [editedName, setEditedName] = useState("");
  const [editedID, setEditedID] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const info = await AsyncStorage.getItem("surveyorInfo");
          if (info) {
            const parsed = JSON.parse(info);
            setSurveyorInfo(parsed);
            setEditedName(parsed.name);
            setEditedID(parsed.surveyorID);
            if (parsed.formId) {
              try {
                const formRes = await axios.get(
                  `http://192.168.0.183:8082/api/v1/auth/getFormById/${parsed.formId}`
                );
                if (formRes.data) {
                  setForms([formRes.data]);
                }
              } catch (formError) {
                console.error("Failed to fetch surveyor's form:", formError);
              }
            }
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

  const handleBoxPress = (form: FormType) => {
    setSelectedForm(form);
    setAnswers({});
    setFormModalVisible(true);
  };

  const confirmSubmit = async () => {
    if (!selectedForm) return;

    const payload = {
      formId: selectedForm._id,
      surveyName: selectedForm.surveyName || "",
      surveyDetails: selectedForm.surveyDetails || "",
      peopleDetails: selectedForm.peopleDetails || {},
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
        setFormModalVisible(false);
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

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    try {
      if (!surveyorInfo?.gmail) return;

      await axios.delete(
        `http://192.168.0.183:8082/api/v1/auth/deleteSurveyor/${surveyorInfo.gmail}`
      );
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
      const res = await axios.put(
        "http://192.168.0.183:8082/api/v1/auth/updateSurveyor",
        {
          gmail: surveyorInfo.gmail,
          name: editedName,
          surveyorID: editedID,
          password: editedPassword || undefined,
        }
      );

      Alert.alert("Success", res.data.message || "Profile updated.");
      const updatedUser = {
        name: editedName,
        surveyorID: editedID,
        gmail: surveyorInfo.gmail,
      };
      await AsyncStorage.setItem("surveyorInfo", JSON.stringify(updatedUser));
      setSurveyorInfo(updatedUser);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-purple-600 flex-row items-center justify-between px-4 py-3 shadow-lg">
        <Text className="text-white text-xl font-semibold">
          Surveyor Dashboard
        </Text>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <FontAwesome name="user-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {surveyorInfo && (
        <View className="bg-purple-100 rounded-xl py-3 px-4 m-4 shadow-lg">
          <Text className="text-purple-900 font-bold text-lg text-center">
            👨 Surveyor Name: {surveyorInfo.name}
          </Text>
          <Text className="text-purple-700 font-bold text-lg text-center">
            🪪 Surveyor ID: {surveyorInfo.surveyorID}
          </Text>
        </View>
      )}

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
          forms.map((form, index) => (
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

      {/* Form Modal and Profile Modal stay as in your original — already complete and correct. You can copy them from your existing file with confidence. */}

      {/* Form Modal */}
      <Modal visible={formModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-purple-950 bg-opacity-70 px-4">
          <View className="bg-white p-4 rounded-2xl max-h-[90%] shadow-lg">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-purple-700 text-center mb-4">
                {selectedForm?.title || "Form Details"}
              </Text>
              {/* Survey Info */}
              <View className="mb-4">
                <TextInput
                  placeholder="Survey Name"
                  value={selectedForm?.surveyName || ""}
                  onChangeText={(text) =>
                    setSelectedForm((prev) =>
                      prev ? { ...prev, surveyName: text } : prev
                    )
                  }
                  className="bg-white border border-gray-300 p-2 rounded mb-2 text-sm text-gray-700"
                />
                <TextInput
                  placeholder="Survey Details"
                  value={selectedForm?.surveyDetails || ""}
                  onChangeText={(text) =>
                    setSelectedForm((prev) =>
                      prev ? { ...prev, surveyDetails: text } : prev
                    )
                  }
                  className="bg-white border border-gray-300 p-2 rounded text-sm text-gray-700"
                />
              </View>

              {/* People Info */}
              <View className="mb-4 bg-gray-50 p-3 rounded-lg border border-purple-100">
                <Text className="text-purple-700 font-semibold mb-2">
                  People Details
                </Text>
                {["name", "mobile", "age", "nid", "division", "district"].map(
                  (field) => (
                    <TextInput
                      key={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={selectedForm?.peopleDetails?.[field] || ""}
                      onChangeText={(text) =>
                        setSelectedForm((prev) =>
                          prev
                            ? {
                                ...prev,
                                peopleDetails: {
                                  ...prev.peopleDetails,
                                  [field]:
                                    field === "age"
                                      ? parseInt(text) || ""
                                      : text,
                                },
                              }
                            : prev
                        )
                      }
                      keyboardType={
                        field === "age" || field === "mobile"
                          ? "numeric"
                          : "default"
                      }
                      className="bg-white border border-gray-300 p-2 rounded mb-2 text-sm text-gray-700"
                    />
                  )
                )}
              </View>

              {selectedForm?.questions?.map((q, idx) => (
                <View
                  key={idx}
                  className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200"
                >
                  <Text className="text-sm font-semibold mb-3 text-purple-700">
                    Question {idx + 1}: {q.question}
                  </Text>

                  {/* Short Answer */}
                  {q.type === "short-answer" && (
                    <TextInput
                      placeholder="Your answer"
                      value={answers[idx] || ""}
                      onChangeText={(text) =>
                        setAnswers((prev) => ({ ...prev, [idx]: text }))
                      }
                      className="border border-gray-300 p-2 rounded bg-white text-sm text-gray-700"
                    />
                  )}

                  {/* Paragraph */}
                  {q.type === "paragraph" && (
                    <TextInput
                      placeholder="Write your detailed answer"
                      value={answers[idx] || ""}
                      multiline
                      numberOfLines={4}
                      onChangeText={(text) =>
                        setAnswers((prev) => ({ ...prev, [idx]: text }))
                      }
                      className="border border-gray-300 p-2 rounded bg-white text-sm text-gray-700 h-24"
                    />
                  )}

                  {/* Multiple Choice */}
                  {q.type === "multiple-choice" &&
                    q.options?.map((opt: string, i: number) => (
                      <TouchableOpacity
                        key={i}
                        className="flex-row items-center mb-2"
                        onPress={() =>
                          setAnswers((prev) => ({ ...prev, [idx]: opt }))
                        }
                      >
                        <Ionicons
                          name={
                            answers[idx] === opt
                              ? "radio-button-on"
                              : "radio-button-off"
                          }
                          size={20}
                          color="#6D28D9"
                        />
                        <Text className="ml-2 text-sm text-gray-800">
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  {/* Checkboxes */}
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
                          <Text className="ml-2 text-sm text-gray-800">
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}

                  {/* Linear Scale */}
                  {q.type === "linear-scale" && (
                    <View className="flex-row items-center justify-between mt-2 px-1">
                      {[...Array(5)].map((_, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() =>
                            setAnswers((prev) => ({ ...prev, [idx]: i + 1 }))
                          }
                        >
                          <Text
                            className={`text-sm ${
                              answers[idx] === i + 1
                                ? "text-purple-700 font-bold"
                                : "text-gray-600"
                            }`}
                          >
                            {i + 1}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Rating */}
                  {q.type === "rating" && (
                    <View className="flex-row items-center mt-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <TouchableOpacity
                          key={num}
                          onPress={() =>
                            setAnswers((prev) => ({ ...prev, [idx]: num }))
                          }
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

                  {/* Multiple Choice Grid */}
                  {q.type === "multiple-choice-grid" && (
                    <View className="border mt-2 rounded p-2 bg-white">
                      {q.rows?.map((row: string, rowIdx: number) => (
                        <View key={rowIdx} className="mb-2">
                          <Text className="text-sm font-semibold text-gray-700 mb-1">
                            {row}
                          </Text>
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
                                <Text className="ml-1 text-sm text-gray-700">
                                  {col}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Checkbox Grid */}
                  {q.type === "checkbox-grid" && (
                    <View className="border mt-2 rounded p-2 bg-white">
                      {q.rows?.map((row: string, rowIdx: number) => (
                        <View key={rowIdx} className="mb-2">
                          <Text className="text-sm font-semibold text-gray-700 mb-1">
                            {row}
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {q.columns?.map((col: string, colIdx: number) => {
                              const checked =
                                answers[idx]?.[row]?.includes(col);
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
                                      [idx]: {
                                        ...(prev[idx] || {}),
                                        [row]: updated,
                                      },
                                    }));
                                  }}
                                >
                                  <Ionicons
                                    name={
                                      checked ? "checkbox" : "square-outline"
                                    }
                                    size={20}
                                    color="#6D28D9"
                                  />
                                  <Text className="ml-1 text-sm text-gray-700">
                                    {col}
                                  </Text>
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

              {/* Submit & Close */}
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="flex-1 mr-2 bg-green-600 py-3 rounded-lg shadow"
                  onPress={confirmSubmit}
                >
                  <Text className="text-center text-white font-bold">
                    Submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 ml-2 bg-red-500 py-3 rounded-lg shadow"
                  onPress={() => setFormModalVisible(false)}
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

      {/* Profile Modal */}
      <Modal visible={profileModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
          <View className="bg-white rounded-2xl p-6 w-11/12">
            <Text className="text-lg font-bold text-center mb-4">
              👤 Your Profile
            </Text>

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
            <TouchableOpacity
              className="bg-purple-600 p-3 rounded-full mb-3"
              onPress={handleUpdateProfile}
            >
              <Text className="text-white text-center font-semibold">
                Update Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-500 p-3 rounded-full mb-3"
              onPress={handleDeleteAccount}
            >
              <Text className="text-white text-center font-semibold">
                Delete Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-400 p-3 rounded-full mb-3"
              onPress={handleLogout}
            >
              <Text className="text-white text-center font-semibold">
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-2"
              onPress={() => setProfileModalVisible(false)}
            >
              <Text className="text-blue-600 text-center font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SurveyorDashboard;

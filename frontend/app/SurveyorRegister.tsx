import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";
import axios from "axios";
import { useRouter } from "expo-router";
import { KeyboardTypeOptions } from "react-native";

export default function surveyorRegister() {
  const navigation = useNavigation();
  const router = useRouter();

  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [surveyorID, setSurveyorID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [nidOrPassport, setNidOrPassport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitSurveyor = async () => {
    try {
      setLoading(true);
      if (!name || !gmail || !surveyorID || !password || !confirmPassword || !mobileNo || !nidOrPassport) {
        Alert.alert("Error", "Please fill all the fields");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        "http://192.168.0.183:8082/api/v1/auth/surveyorRegister",
        { name, gmail, surveyorID, password, confirmPassword, mobileNo, nidOrPassport }
      );

      Alert.alert("Success", "Add Surveyor for form done!");
      router.push("/SurveyorList");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  type InputItem = {
    placeholder: string;
    value: string;
    set: (text: string) => void;
    secure?: boolean;
    keyboardType?: KeyboardTypeOptions;
  };

  const inputItems: InputItem[] = [
    { placeholder: "Name", value: name, set: setName },
    { placeholder: "Gmail", value: gmail, set: setGmail },
    { placeholder: "Surveyor ID", value: surveyorID, set: setSurveyorID },
    { placeholder: "Password", value: password, set: setPassword, secure: true },
    { placeholder: "Confirm Password", value: confirmPassword, set: setConfirmPassword, secure: true },
    { placeholder: "Mobile No", value: mobileNo, set: setMobileNo, keyboardType: "number-pad" },
    { placeholder: "NID or Passport", value: nidOrPassport, set: setNidOrPassport },
  ];

  return (
    <SafeAreaView className="flex-1 bg-purple-100">
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={26} color="#4B0082" />
          </TouchableOpacity>
          <ProfileCom/>
        </View>

        <Text className="text-purple-800 font-extrabold text-3xl mb-4 text-center">Add a Surveyor</Text>

        {/* Input Fields */}
        <View className="bg-white p-4 rounded-2xl shadow-md">
          {inputItems.map((item, index) => (
            <TextInput
              key={index}
              placeholder={item.placeholder}
              placeholderTextColor="#6B7280"
              className="h-12 bg-gray-100 text-black px-4 text-base font-medium rounded-lg mb-3 border border-gray-300"
              value={item.value}
              onChangeText={item.set}
              secureTextEntry={item.secure}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
            />
          ))}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            className="bg-yellow-300 px-5 py-3 rounded-xl shadow-md"
            onPress={() => {
              setName("");
              setGmail("");
              setSurveyorID("");
              setPassword("");
              setConfirmPassword("");
              setMobileNo("");
              setNidOrPassport("");
            }}
          >
            <Text className="text-black font-semibold">Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 px-6 py-3 rounded-xl shadow-md"
            onPress={handleSubmitSurveyor}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-around p-2 bg-white border-t border-gray-200 shadow-lg">
          <TouchableOpacity onPress={() => router.push("/InviteSelfServeyor")}>
            <FontAwesome name="users" size={26} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
            <FontAwesome name="home" size={26} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/SettingsMenu")}>
            <FontAwesome name="cogs" size={26} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardTypeOptions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileCom from "@/components/ProfileCom";

export default function surveyorRegister() {
  const navigation = useNavigation();
  const router = useRouter();
  const { formId } = useLocalSearchParams();
  console.log("Form ID from URL:", formId);

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
      if (
        !name ||
        !gmail ||
        !surveyorID ||
        !password ||
        !confirmPassword ||
        !mobileNo ||
        !nidOrPassport
      ) {
        Alert.alert("Error", "Please fill all the fields");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `http://192.168.0.183:8082/api/v1/auth/SurveyorRegister?formId=${formId}`,
        {
          name,
          gmail,
          surveyorID,
          password,
          confirmPassword,
          mobileNo,
          nidOrPassport,
        }
      );

      // ✅ Store data for ProfileCom
      const formattedUser = {
        _id: data._id,
        userName: data.name,
        email: data.gmail,
        contactNo: data.mobileNo,
        DOB: data.DOB || "",
        role: data.role || "Researcher",
        createdAt: data.createdAt || new Date().toISOString(),
      };

      await AsyncStorage.setItem("userData", JSON.stringify(formattedUser));

      Alert.alert("Success", "Add Surveyor for form done!");
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Something went wrong"
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputItems: {
    placeholder: string;
    value: string;
    set: (text: string) => void;
    secure?: boolean;
    keyboardType?: KeyboardTypeOptions;
  }[] = [
    { placeholder: "Name", value: name, set: setName },
    { placeholder: "Gmail", value: gmail, set: setGmail },
    { placeholder: "Surveyor ID", value: surveyorID, set: setSurveyorID },
    {
      placeholder: "Password",
      value: password,
      set: setPassword,
      secure: true,
    },
    {
      placeholder: "Confirm Password",
      value: confirmPassword,
      set: setConfirmPassword,
      secure: true,
    },
    {
      placeholder: "Mobile No",
      value: mobileNo,
      set: setMobileNo,
      keyboardType: "number-pad",
    },
    {
      placeholder: "NID or Passport",
      value: nidOrPassport,
      set: setNidOrPassport,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      <View className="flex-1 bg-purple-600 p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <ProfileCom />
        </View>

        <Text className="text-black font-bold text-3xl mb-6">
          Add a Surveyor!
        </Text>

        {/* Input Fields */}
        {inputItems.map((item, index) => (
          <TextInput
            key={index}
            placeholder={item.placeholder}
            placeholderTextColor="black"
            className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
            value={item.value}
            onChangeText={item.set}
            secureTextEntry={item.secure}
            keyboardType={item.keyboardType}
          />
        ))}

        {/* Action Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="bg-gray-300 px-4 py-2 rounded-lg"
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
            <Text className="text-black font-bold">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-300 px-4 py-2 rounded-lg"
            onPress={handleSubmitSurveyor}
          >
            <Text className="text-black font-bold">
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-around p-2">
          <TouchableOpacity
            className="bg-gray-500 p-3 rounded-lg"
            onPress={() => router.push("/InviteSelfServeyor")}
          >
            <FontAwesome name="users" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-500 p-3 rounded-lg"
            onPress={() => router.push("/HomeScreen")}
          >
            <FontAwesome name="home" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-500 p-3 rounded-lg"
            onPress={() => router.push("/SettingsMenu")}
          >
            <FontAwesome name="bars" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

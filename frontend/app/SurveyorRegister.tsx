import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native"; // Optional if not using it
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";
import axios from "axios";
import { useRouter } from "expo-router"; // ✅ Correct import for router

export default function InviteAddScreen() {
  const navigation = useNavigation();
  const router = useRouter(); // ✅ Initialize router from expo-router

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
        "http://192.168.0.183:8082/api/v1/auth/surveyorRegister",
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

      alert(data && data.message);
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

        {/* Title */}
        <TouchableOpacity className="mb-8 p-3 rounded-lg">
          <Text className="text-black font-bold text-left text-3xl">
            Add a Surveyor!
          </Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <TextInput
          placeholder="name"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Gmail"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
          value={gmail}
          onChangeText={setGmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="surveyorID"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
          value={surveyorID}
          onChangeText={setSurveyorID}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm password"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-6"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TextInput
          placeholder="Mobile no"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="number-pad"
          inputMode="numeric"
        />
        <TextInput
          placeholder="nidOrPassport"
          placeholderTextColor="black"
          className="h-12 bg-white text-black px-4 text-base font-semibold rounded-full mb-4"
          value={nidOrPassport}
          onChangeText={setNidOrPassport}
        />

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

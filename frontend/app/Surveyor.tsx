import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";

const SurveyorScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header */}
      <View className="bg-purple-500 flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() =>  router.push("/HomeScreen")}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <ProfileCom/>
       
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
      >
        {/* Collaborator Name */}
        <TouchableOpacity className="bg-gray-400 rounded-full py-4 my-2">
          <Text className="text-center text-white font-semibold text-lg">
            Surveyor Name
          </Text>
        </TouchableOpacity>

        {/* Collaborator ID */}
        <TouchableOpacity className="bg-gray-400 rounded-full py-4 my-2">
          <Text className="text-center text-white font-semibold text-lg">
            Surveyor ID
          </Text>
        </TouchableOpacity>

        {/* Work On Template */}
        <TouchableOpacity className="bg-gray-400 rounded-full py-4 my-2">
          <Text className="text-center text-white font-semibold text-lg">
            Work On Template
          </Text>
        </TouchableOpacity>

        {/* Publish Template */}
        <View className="my-4">
          {/* First Row: Two Buttons */}
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-gray-400 h-24 w-1/2 mx-1 justify-center items-center">
              <Text className="text-white font-semibold text-base">
                Button 1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-400 h-24 w-1/2 mx-1 justify-center items-center">
              <Text className="text-white font-semibold text-base">
                Button 2
              </Text>
            </TouchableOpacity>
          </View>

          {/* Second Row: Two Buttons */}
          <View className="flex-row justify-between my-4">
            <TouchableOpacity className="bg-gray-400 h-24 w-1/2 mx-1 justify-center items-center">
              <Text className="text-white font-semibold text-base">
                Button 3
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-400 h-24 w-1/2 mx-1 justify-center items-center">
              <Text className="text-white font-semibold text-base">
                Button 4
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row bg-purple-500 py-4 justify-between px-8">
        <TouchableOpacity>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SurveyorScreen;

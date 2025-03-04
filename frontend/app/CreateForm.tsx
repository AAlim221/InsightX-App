import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ProfileCom from "@/components/ProfileCom";
import QuesBoxCom from "@/components/QuesBoxCom";
import PeopleInfoCom from "@/components/PeopleInfoCom";
type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CreateForm">;

const CreateForm: React.FC<Props> = ({ navigation }) => {
  const [isRequired, setIsRequired] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      {/* Header Section */}
      <View className="px-4 pt-6 flex-row justify-between items-center gap-4 mb-4">
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Undo/Redo and Theme Icons */}
        <View className="flex-row space-x-4 gap-5">
          <TouchableOpacity>
            <FontAwesome name="undo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="repeat" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="paint-brush" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Publish Button */}
        <TouchableOpacity
          className="bg-yellow-400 px-4 py-2 rounded-lg ml-16"
          onPress={() => alert("Published!")}
        >
          <Text className="text-black font-bold">Publish</Text>
        </TouchableOpacity>

        {/* User Profile Icon */}
        <ProfileCom />
      </View>

      <ScrollView className="px-4">
        {/* Survey Title Input */}
        <View className="mt-2 bg-white p-4 rounded-lg shadow-md gap-4">
          <TextInput
            placeholder="Survey title"
            placeholderTextColor="white"
            className="bg-purple-600 text-white text-center py-3 rounded-lg"
          />
        </View>

        {/* People information section */}
        <PeopleInfoCom />

        {/* Survey Name and Details Input */}
        <View className="mt-4 bg-white p-4 rounded-lg shadow-md gap-4">
          <TextInput
            placeholder="Survey Name"
            className="bg-purple-400 text-black py-2 px-4 rounded-lg"
          />

          <TextInput
            placeholder="Survey Details"
            className="bg-purple-400 text-black py-2 px-4 rounded-lg"
          />
        </View>

        {/* Question Sections */}
        <QuesBoxCom />
        <QuesBoxCom />
        <QuesBoxCom />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center bg-purple-500 p-4 shadow-lg">
        <TouchableOpacity onPress={() => alert("TitleBar Copy")}>
          <Text className="text-white text-lg font-bold">TT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("QuestionBox With Option Copy")}>
          <FontAwesome name="plus-circle" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          <FontAwesome name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="download" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="bars" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateForm;

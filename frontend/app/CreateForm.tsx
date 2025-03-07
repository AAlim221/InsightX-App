import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import QuesBoxCom from "@/components/QuesBoxCom";
import PeopleInfoCom from "@/components/PeopleInfoCom";
import HeaderOfTemplate from "@/components/HeaderOfTemplate";
import BottomNavCom from "@/components/BottomNavCom";
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
      <HeaderOfTemplate />

      <ScrollView className="px-4">
        {/* Survey Title Input */}
        <View className="mt-2 bg-white p-4 rounded-lg shadow-md">
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
        <QuesBoxCom />
        <QuesBoxCom />
        <QuesBoxCom />
        <QuesBoxCom />
        <QuesBoxCom />
        <QuesBoxCom />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavCom />
    </SafeAreaView>
  );
};

export default CreateForm;

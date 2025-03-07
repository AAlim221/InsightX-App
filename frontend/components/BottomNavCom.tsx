import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the navigation type (adjust routes as needed)
type RootStackParamList = {
  HomeScreen: undefined;
};

const BottomNavCom: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
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
  );
};

export default BottomNavCom;

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

// Define types for navigation
type RootStackParamList = {
  index: undefined;  // Add more routes if needed
};

// Use the correct type for navigation
const ProfileCom = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    // Handle logout logic (e.g., clear token, session data)
    navigation.navigate("index");  // Make sure "index" matches your route name
  };

  return (
    <View className="flex items-center">
      {/* Log Button with Profile Icon */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="p-2 bg-blue-600 rounded-full"
      >
        <FontAwesome name="user-circle" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for Profile/Logout */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-11/12 shadow-lg">
            <Text className="text-center text-xl font-semibold mb-5">
              Profile
            </Text>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-center mt-5 p-3 bg-red-500 rounded-full shadow-lg"
            >
              <FontAwesome name="sign-out" size={24} color="white" />
              <Text className="text-amber-400 text-lg ml-3">Logout</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-5 flex items-center"
            >
              <Text className="text-blue-500 text-lg font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileCom;

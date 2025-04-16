import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navigation types
type RootStackParamList = {
  index: undefined;
};

// User type
type UserType = {
  _id: string;
  userName: string;
  email: string;
  contactNo: string;
  DOB: string;
  role: string;
  createdAt: string;
};

const ProfileCom = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    navigation.navigate("index");
  };

  // Handle save after editing
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://192.168.0.183:8082/api/v1/auth/updateResearcher/${editedUser?._id}`,
        editedUser
      );
      if (res.status === 200) {
        Alert.alert("Updated", "Your profile has been updated.");
        setEditMode(false);
        setUser(editedUser); // Update the user data in state
        await AsyncStorage.setItem("userData", JSON.stringify(editedUser)); // Store updated data in AsyncStorage
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    Alert.alert("Confirm", "Do you really want to delete this account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(
              `http://192.168.0.183:8082/api/v1/auth/deleteResearcher/${user?._id}`
            );
            Alert.alert("Deleted", "Account has been deleted.");
            await AsyncStorage.removeItem("userData"); // Remove the user data from AsyncStorage
            navigation.navigate("index"); // Navigate to index or home screen
          } catch (err) {
            Alert.alert("Error", "Deletion failed.");
          }
        },
      },
    ]);
  };

  // Render the Profile modal
  return (
    <View className="flex items-center">
      {/* Button to open profile modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="p-2 bg-white rounded-full"
      >
        <FontAwesome name="user-circle" size={30} color="#6D28D9" />
      </TouchableOpacity>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-60 px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            <Text className="text-center text-xl font-bold text-purple-800 mb-5">
              Researcher Profile
            </Text>

            {/* Display User Fields */}
            {[
              { label: "User Name", field: "userName" },
              { label: "Email", field: "email" },
              { label: "Contact No", field: "contactNo" },
              { label: "Date of Birth", field: "DOB" },
              { label: "Role", field: "role" },
              { label: "ID", field: "_id" },
              { label: "Created At", field: "createdAt" },
            ].map(({ label, field }) => (
              <View key={field} className="mb-4">
                <Text className="text-gray-700 mb-1 capitalize">{label}</Text>
                {editMode ? (
                  <TextInput
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={editedUser?.[field as keyof UserType] || ""}
                    onChangeText={(text) =>
                      setEditedUser((prev: any) => ({
                        ...prev,
                        [field]: text,
                      }))
                    }
                  />
                ) : (
                  <Text className="bg-gray-100 rounded-md px-3 py-2">
                    {user?.[field as keyof UserType] || "N/A"}
                  </Text>
                )}
              </View>
            ))}

            {/* Action Buttons */}
            <View className="flex-row justify-between mt-6">
              {editMode ? (
                <TouchableOpacity
                  className="flex-1 mr-2 bg-green-600 py-3 rounded-full"
                  onPress={handleSave}
                >
                  <Text className="text-center text-white font-bold">Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex-1 mr-2 bg-yellow-500 py-3 rounded-full"
                  onPress={() => setEditMode(true)}
                >
                  <Text className="text-center text-white font-bold">Edit</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="flex-1 ml-2 bg-red-500 py-3 rounded-full"
                onPress={handleDelete}
              >
                <Text className="text-center text-white font-bold">Delete</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-center mt-6 p-3 bg-blue-700 rounded-full shadow-lg"
            >
              <FontAwesome name="sign-out" size={24} color="white" />
              <Text className="text-white text-lg ml-3">Logout</Text>
            </TouchableOpacity>

            {/* Close Modal */}
            <TouchableOpacity
              className="mt-5 flex items-center"
              onPress={() => {
                setEditMode(false);
                setModalVisible(false);
              }}
            >
              <Text className="text-blue-500 text-lg font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileCom;

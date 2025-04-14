import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";

// Navigation types
type RootStackParamList = {
  index: undefined;
};

// User type
type UserType = {
  name: string;
  email: string;
  _id: string;
};

const ProfileCom = ({ user }: { user: UserType | null }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(user);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    // You can clear tokens here if using auth
    navigation.navigate("index");
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://192.168.0.183:8082/api/v1/auth/updateResearcher/${editedUser?._id}`,
        editedUser
      );
      if (res.status === 200) {
        Alert.alert("Updated", "Your profile has been updated.");
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

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
            navigation.navigate("index");
          } catch (err) {
            Alert.alert("Error", "Deletion failed.");
          }
        },
      },
    ]);
  };

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

            {["name", "email"].map((field) => (
              <View key={field} className="mb-4">
                <Text className="text-gray-700 mb-1 capitalize">{field}</Text>
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

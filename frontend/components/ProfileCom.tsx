import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Navigation types
type RootStackParamList = {
  index: undefined;
};

// Match exact MongoDB structure
type UserType = {
  _id: string;
  userName: string;
  email: string;
  contactno: string;
  DOB: string;
  role: string;
  createdAt: string;
};

const ProfileCom = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        console.log("🧪 Raw storedUserData:", storedUserData);

        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          console.log("✅ Parsed user:", parsedData);
          setUser(parsedData);
        } else {
          console.warn("⚠️ No user data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("❌ Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
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
        setUser(editedUser);
        await AsyncStorage.setItem("userData", JSON.stringify(editedUser));
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
            await AsyncStorage.removeItem("userData");
            navigation.navigate("index");
          } catch (err) {
            Alert.alert("Error", "Deletion failed.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6D28D9" />
        <Text className="mt-4 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex items-center">
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
              { label: "Contact No", field: "contactno" },
              { label: "Date Of Birth", field: "DOB" },
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
                      setEditedUser((prev) => ({
                        ...prev!,
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
                  onPress={() => {
                    setEditMode(true);
                    setEditedUser(user);
                  }}
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

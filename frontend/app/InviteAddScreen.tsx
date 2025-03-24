import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";


const InviteAddScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
        <View className="flex-1 bg-purple-600 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <FontAwesome name="user-circle" size={32} color="black" />
      </View>

      {/* Researcher Details */}
      <View className="bg-gray-300 p-3 rounded-lg mb-2">
        <Text className="text-black font-bold">Researcher Name</Text>
      </View>
      <View className="bg-gray-300 p-3 rounded-lg mb-4">
        <Text className="text-black font-bold">Researcher ID</Text>
      </View>

      {/* Add Surveyor Button */}
      <TouchableOpacity className="bg-gray-300 p-3 rounded-lg mb-4">
        <Text className="text-black font-bold text-center">Add Surveyor</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      {['Surveyor Name', 'Surveyor ID', 'Password', 'Mobile No', 'NID/Passport'].map((placeholder, index) => (
        <TextInput
          key={index}
          placeholder={placeholder}
          className="bg-gray-300 p-3 rounded-lg mb-3 text-black"
        />
      ))}

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-lg">
          <Text className="text-black font-bold">Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-lg">
          <Text className="text-black font-bold">Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Navigation */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-around p-2">
        <TouchableOpacity className="bg-gray-500 p-3 rounded-lg">
          <FontAwesome name="users" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-500 p-3 rounded-lg">
          <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-500 p-3 rounded-lg">
          <FontAwesome name="bars" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
    
  );
};

export default InviteAddScreen;

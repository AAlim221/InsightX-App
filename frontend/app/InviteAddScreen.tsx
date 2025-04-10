import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from '@/components/ProfileCom';
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

       {/* Profile Icon */}
       <ProfileCom />
      </View>
      {/* Add Surveyor Button */}
      <TouchableOpacity className="mb-8 p-3 rounded-lg ">
        <Text className="text-black font-bold text-left text-3xl">Add a Surveyor!</Text>
      </TouchableOpacity>

      {/* Input Fields */}
      {['Surveyor Name','Surveyor Gmail', 'Surveyor ID', 'Password', 'Confirm Password','Mobile No', 'NID/Passport'].map((placeholder, index) => (
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

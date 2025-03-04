import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PeopleInfoCom = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-purple-500 rounded-2xl">
        <View className="w-full bg-gray-300 p-4 mb-6 rounded-md">
        <Text className="text-black text-xl font-bold text-center">People Information</Text>
      </View>
      <View className="w-full bg-gray-300 p-4 mb-2 rounded-md">
        <TextInput
          placeholder="Enter People name"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
         <TextInput
          placeholder="Enter Age"
          keyboardType="numeric"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
          <TextInput
          placeholder="Enter Nid/Passport"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Enter Mobile number"
          keyboardType="phone-pad"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
         <TextInput
          placeholder="Enter Division"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Enter District"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
        <TextInput
          placeholder="Enter Thana"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
        />
      </View>
    </SafeAreaView>
  );
};

export default PeopleInfoCom;

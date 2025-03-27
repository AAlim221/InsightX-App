import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Add a prop to handle state update
interface PeopleInfoComProps {
  onPeopleInfoChange: (updatedInfo: { [key: string]: string }) => void;
}

const PeopleInfoCom: React.FC<PeopleInfoComProps> = ({ onPeopleInfoChange }) => {
  const [peopleInfo, setPeopleInfo] = useState({
    name: "",
    age: "",
    nid: "",
    mobile: "",
    division: "",
    district: "",
    thana: "",
  });

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    const updatedInfo = { ...peopleInfo, [field]: value };
    setPeopleInfo(updatedInfo);
    onPeopleInfoChange(updatedInfo); // Call the parent callback to update the parent state
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-purple-500 rounded-2xl">
      <View className="w-full bg-white p-4 mb-6 mt-4 rounded-md">
        <Text className="text-black text-xl font-bold text-center">People Information</Text>
      </View>
      <View className="w-full bg-white p-4 mb-2 rounded-md">
        <TextInput
          placeholder="Enter People name"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
        <TextInput
          placeholder="Enter Age"
          keyboardType="numeric"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.age}
          onChangeText={(text) => handleInputChange("age", text)}
        />
        <TextInput
          placeholder="Enter Nid/Passport"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.nid}
          onChangeText={(text) => handleInputChange("nid", text)}
        />
        <TextInput
          placeholder="Enter Mobile number"
          keyboardType="phone-pad"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.mobile}
          onChangeText={(text) => handleInputChange("mobile", text)}
        />
        <TextInput
          placeholder="Enter Division"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.division}
          onChangeText={(text) => handleInputChange("division", text)}
        />
        <TextInput
          placeholder="Enter District"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.district}
          onChangeText={(text) => handleInputChange("district", text)}
        />
        <TextInput
          placeholder="Enter Thana"
          className="w-full p-2 mt-2 bg-white border-2 border-gray-300 rounded-md"
          value={peopleInfo.thana}
          onChangeText={(text) => handleInputChange("thana", text)}
        />
      </View>
    </SafeAreaView>
  );
};

export default PeopleInfoCom;

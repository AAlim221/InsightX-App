import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProfileCom from '@/components/ProfileCom';
import QuesBoxCom from '@/components/QuesBoxCom';

// Define your stack params
type RootStackParamList = {
  CreateForm: undefined;
  HomeScreen: undefined;
};

// Define the props for navigation
type Props = NativeStackScreenProps<RootStackParamList, 'CreateForm'>;

const CreateForm: React.FC<Props> = ({ navigation }) => {
  const [isRequired, setIsRequired] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      {/* Header Section */}
      <View className="px-4 pt-6 flex-row justify-between items-center gap-4 mb-4">
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Undo/Redo and Theme Icons */}
        <View className="flex-row space-x-4 gap-5">
          <TouchableOpacity>
            <FontAwesome name="undo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="repeat" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="paint-brush" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Publish Button */}
        <TouchableOpacity
          className="bg-yellow-400 px-4 py-2 rounded-lg ml-16"
          onPress={() => alert('Published!')}
        >
          <Text className="text-black font-bold">Publish</Text>
        </TouchableOpacity>

        {/* User Profile Icon */}
        <ProfileCom />
      </View>

      <ScrollView className="px-4">
        {/* Survey Title Input */}
        <View className="mt-4 bg-white p-4 rounded-lg shadow-md gap-4">
          <TextInput
            placeholder="Survey title"
            placeholderTextColor="white"
            className="bg-purple-600 text-white text-center py-3 rounded-lg"
          />
        </View>
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

        {/* Question Section 1st */}
        <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <TextInput
            placeholder="Write Question here"
            className="text-black text-xl font-bold"
          />
        </View>

        {/* Options Section */}
        <View className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
          {/* Question Type Dropdown */}
          <View className="flex-row items-center justify-between">
            <Text className="text-black font-bold">Multiple choice</Text>
            <Ionicons name="chevron-down" size={24} color="black" />
          </View>

          {/* Options */}
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
        </View>

        {/* Required Toggle */}
        <View className="mt-4 flex-row justify-between items-center">
          <MaterialIcons name="content-copy" size={24} color="black" />
          <View className="flex-row items-center space-x-2">
            <Text className="text-slate-900 font-bold">Required</Text>
            <Switch
              value={isRequired}
              onValueChange={setIsRequired}
              trackColor={{ true: '#69fffd', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>   
        </View>
         {/* Question Section 2nd */}
         <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <TextInput
            placeholder="Write Question here"
            className="text-black text-xl font-bold"
          />
        </View>

        {/* Options Section */}
        <View className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
          {/* Question Type Dropdown */}
          <View className="flex-row items-center justify-between">
            <Text className="text-black font-bold">Multiple choice</Text>
            <Ionicons name="chevron-down" size={24} color="black" />
          </View>

          {/* Options */}
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="radio-button-off" size={24} color="black" />
            <Text className="ml-2 text-black">Add Option</Text>
          </TouchableOpacity>
        </View>

        {/* Required Toggle */}
        <View className="mt-4 flex-row justify-between items-center">
          <MaterialIcons name="content-copy" size={24} color="black" />
          <View className="flex-row items-center space-x-2">
            <Text className="text-slate-900 font-bold">Required</Text>
            <Switch
              value={isRequired}
              onValueChange={setIsRequired}
              trackColor={{ true: '#69fffd', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>   
        </View>
        <QuesBoxCom/>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center bg-purple-500 p-4 shadow-lg">
        <TouchableOpacity onPress={() => alert('Tooltip selected')}>
          <Text className="text-white text-lg font-bold">TT</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="plus-circle" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <FontAwesome name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="download" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="bars" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateForm;

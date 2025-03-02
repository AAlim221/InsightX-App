import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ProfileCom from '@/components/ProfileCom'


// Define your types
type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
};

// Define navigation types
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'> &
  DrawerNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
  // Use the navigation hook
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header Section */}
      <View className="px-4 pt-6 flex-row justify-between items-center">
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Log Button with Profile Icon 
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={24} color="white" />
        </TouchableOpacity>*/}
        <ProfileCom/>
      </View>

      {/* Search Section */}
      <View className="px-4 pt-4">
        <Text className="text-white text-2xl font-bold">Search</Text>
        <Text className="text-pink-400 text-2xl font-bold">Templates</Text>
        <View className="flex-row items-center mt-4">
          <TextInput
            className="flex-1 bg-white text-black px-4 py-4 rounded-lg"
            placeholder="Search here"
          />
          <TouchableOpacity className="ml-2 bg-yellow-300 p-3 rounded-lg">
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Section */}
      <View className="px-4 mt-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Categories</Text>
          <TouchableOpacity>
            <Text className="text-pink-400 text-lg font-bold">More</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row mt-4">
          {/* Categories - Clickable Links */}
          <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
          <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
          <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
          <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
          <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
        </View>
      </View>

      {/* Templates Section */}
      <View className=" bg-purple-500 px-4 mt-6 flex-auto">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold mt-3">Templates</Text>
          <TouchableOpacity>
            <Text className="text-white text-lg font-bold mt-3">View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex flex-row flex-wrap justify-between">
            {/* Scrollable Templates */}
            <View className="bg-white w-[48%] h-52 flex items-center justify-center mb-4">
              <Text className="text-black text-4xl">+</Text>
            </View>
            <View className="bg-white w-[48%] h-52 mb-4"></View>
            <View className="bg-white w-[48%] h-52"></View>
            <View className="bg-white w-[48%] h-52"></View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View className="flex-row justify-evenly items-center bg-violet-900 p-2">
        <TouchableOpacity onPress={() => navigation.navigate("CreateForm")}>
          <FontAwesome name="plus-circle" size={38} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
          <FontAwesome name="home" size={38} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" size={38} color="gray" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  HomeScreen: undefined;
  Template1: undefined;
  Template2: undefined;
  Template3: undefined;
  Template4: undefined;
  Template5: undefined;
};

type TemplatesSectionComNavigationProp = StackNavigationProp<RootStackParamList, 'Template5'>;

const TemplatesSectionCom = () => {
  // Get the navigation object from useNavigation inside the component
  const navigation = useNavigation<TemplatesSectionComNavigationProp>();

  const handleTemplatePress = (templateName: keyof RootStackParamList) => {
    navigation.navigate(templateName);
  };

  // Define the handleViewAllPress function to navigate to Template5 screen
  const handleViewAllPress = () => {
    navigation.navigate('Template5');
  };

  return (
    <View className="bg-purple-500 px-4 mt-6 flex-auto">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xl font-bold mt-3">Templates</Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text className="text-white text-lg font-bold mt-3">View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex flex-row flex-wrap justify-between">
          {/* Scrollable Templates */}
          <Pressable
            className="bg-white w-[48%] h-52 flex items-center justify-center mb-4"
            onPress={() => handleTemplatePress('Template1')}
          >
            <Text className="text-black text-4xl">+</Text>
          </Pressable>
          <Pressable
            className="bg-white w-[48%] h-52 mb-4"
            onPress={() => handleTemplatePress('Template2')}
          />
          <Pressable
            className="bg-white w-[48%] h-52 mb-4"
            onPress={() => handleTemplatePress('Template3')}
          />
          <Pressable
            className="bg-white w-[48%] h-52 mb-4"
            onPress={() => handleTemplatePress('Template4')}
          />
          <Pressable
            className="bg-white w-[48%] h-52 mb-4"
            onPress={() => handleTemplatePress('Template5')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default TemplatesSectionCom;

import { View, Text, TouchableOpacity, ScrollView, Pressable, ImageBackground } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Define the stack param list
type RootStackParamList = {
  HomeScreen: undefined;
  Template1: undefined;
  Template2: undefined;
  Template3: undefined;
  Template4: undefined;
  Template5: undefined;
  Template6: undefined;
  Surveyor:undefined;
  InviteAddScreen:undefined;

};

type TemplatesSectionComNavigationProp = StackNavigationProp<RootStackParamList, 'Surveyor'>;

const TemplatesSectionCom = () => {
  // Get the navigation object from useNavigation inside the component
  const navigation = useNavigation<TemplatesSectionComNavigationProp>();

  const handleTemplatePress = (templateName: keyof RootStackParamList) => {
    navigation.navigate(templateName);
  };

  // Define the handleViewAllPress function to navigate to Template5 screen
  const handleViewAllPress = () => {
    navigation.navigate('InviteAddScreen');
  };

  // Template data with names and background images
  const templates = [
    { name: 'Template 1', screen: 'Template1', image: require('../assets/images/Temp1.png') },
    { name: 'Template 2', screen: 'Template2', image: require('../assets/images/Temp2.png') },
    { name: 'Template 3', screen: 'Template3', image: require('../assets/images/Temp3.png') },
    { name: 'Template 4', screen: 'Template4', image: require('../assets/images/Temp4.png') },
    { name: 'Template 5', screen: 'Template5', image: require('../assets/images/Temp5.png') },
    { name: 'Template 6', screen: 'Surveyor', image: require('../assets/images/Temp5.png') },
  ];

  return (
    <View className="bg-purple-500 px-4 mt-6 flex-auto">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xl font-bold mt-3">Templates</Text>
        <TouchableOpacity onPress={handleViewAllPress}>
          <Text className="text-white text-lg font-bold mt-3">View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="mt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex flex-row flex-wrap justify-between">
          {templates.map((template, index) => (
            <Pressable
              key={index}
              className="bg-white w-[48%] h-52 mb-4 rounded-lg overflow-hidden"
              onPress={() => handleTemplatePress(template.screen as keyof RootStackParamList)}
            >
              <ImageBackground source={template.image} className="w-full h-full flex items-center justify-center">
                <Text className="text-white text-lg font-bold bg-black bg-opacity-50 px-2 py-1 rounded-md">
                  {template.name}
                </Text>
              </ImageBackground>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TemplatesSectionCom;

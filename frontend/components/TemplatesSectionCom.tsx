import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';

type RootStackParamList = {
  HomeScreen: undefined;
  Template1: undefined;
  Template2: undefined;
  Template3: undefined;
  Template4: undefined;
  Template5: undefined;
  ResponseQuestion: undefined;
};

type TemplatesSectionComNavigationProp = StackNavigationProp<RootStackParamList, 'ResponseQuestion'>;

const TemplatesSectionCom = () => {
  const navigation = useNavigation<TemplatesSectionComNavigationProp>();

  const [showAll, setShowAll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Health', 'Education', 'Survey', 'Business', 'Feedback'];

  const templates = [
    { name: 'Template 1', screen: 'Template1', image: require('../assets/images/Temp1.png'), category: 'Health' },
    { name: 'Template 2', screen: 'Template2', image: require('../assets/images/Temp2.png'), category: 'Education' },
    { name: 'Template 3', screen: 'Template3', image: require('../assets/images/Temp3.png'), category: 'Survey' },
    { name: 'Template 4', screen: 'Template4', image: require('../assets/images/Temp4.png'), category: 'Business' },
    { name: 'Template 5', screen: 'Template5', image: require('../assets/images/Temp5.png'), category: 'Feedback' },
  ];

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template =>
      template.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!selectedCategory || template.category === selectedCategory)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const visibleTemplates = showAll ? filteredTemplates : filteredTemplates.slice(0, 4);

  const handleTemplatePress = (templateName: keyof RootStackParamList) => {
    navigation.navigate(templateName);
  };

  return (
    <View className="bg-purple-500 flex-1">
      {/* Search Section */}
      <View className="bg-black px-4 pt-4 pb-4">
        <Text className="text-white text-2xl font-bold">Search</Text>
        <Text className="text-pink-400 text-2xl font-bold">Templates</Text>
        <View className="flex-row items-center mt-4">
          <TextInput
            className="flex-1 bg-white text-black px-4 py-4 rounded-lg"
            placeholder="Search here"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity className="ml-2 bg-yellow-300 p-3 rounded-lg">
            <FontAwesome name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Section */}
      <View className="bg-black px-4 pt-4 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Categories</Text>
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text className="text-pink-400 text-lg font-bold">Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className={`w-20 h-12 rounded-lg mr-2 justify-center items-center ${
                selectedCategory === category ? 'bg-yellow-400' : 'bg-white'
              }`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text className="text-black font-semibold">{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Templates Section */}
      <View className="px-4 mt-4 flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold mt-3">Templates</Text>
          {!showAll && filteredTemplates.length > 4 && (
            <TouchableOpacity onPress={() => setShowAll(true)}>
              <Text className="text-white text-lg font-bold mt-3">View All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView className="mt-4" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="flex flex-row flex-wrap justify-between">
            {visibleTemplates.map((template, index) => (
              <Pressable
                key={index}
                className="bg-white w-[48%] h-52 mb-4 rounded-lg overflow-hidden"
                onPress={() => handleTemplatePress(template.screen as keyof RootStackParamList)}
              >
                <ImageBackground
                  source={template.image}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Text className="text-white text-lg font-bold bg-black bg-opacity-50 px-2 py-1 rounded-md">
                    {template.name}
                  </Text>
                </ImageBackground>
              </Pressable>
            ))}
            {visibleTemplates.length === 0 && (
              <Text className="text-white mt-6 text-center w-full">No templates found.</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default TemplatesSectionCom;

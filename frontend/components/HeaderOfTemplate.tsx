import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProfileCom from './ProfileCom'; // Ensure ProfileCom is correctly imported


  type HeaderOfTemplateProps = {
    handleSubmit: () => Promise<void>;
  };
  
  const HeaderOfTemplate: React.FC<HeaderOfTemplateProps> = ({ handleSubmit }) => {
    const navigation = useNavigation(); 
   
  return (
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
        onPress={() => handleSubmit()}    // Use the function from props
      >
        <Text className="text-black font-bold">Publish</Text>
      </TouchableOpacity>

      {/* User Profile Icon */}
      <ProfileCom />
    </View>
  );
};

export default HeaderOfTemplate;
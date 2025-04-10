import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router } from "expo-router";

// Define your types for stack and drawer navigation
type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
  SettingsMenu: undefined;
};

// Combine NativeStack and Drawer navigation types
type CombinedNavigationProp = NativeStackNavigationProp<RootStackParamList> &
  DrawerNavigationProp<RootStackParamList>;

const ButtonFooterCom: React.FC = () => {
  const navigation = useNavigation<CombinedNavigationProp>();

  return (
    <View className="flex-row justify-around items-center bg-violet-900 p-4">
      {/* Create Form */}
      <TouchableOpacity onPress={() => navigation.navigate('CreateForm')}>
        <FontAwesome name="plus-circle" size={36} color="#D1D5DB" /> {/* gray-300 */}
      </TouchableOpacity>

      {/* Home */}
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <FontAwesome name="home" size={36} color="#D1D5DB" />
      </TouchableOpacity>

     {/* Settings / Drawer */}
<TouchableOpacity onPress={() => router.push('/SettingsMenu')}>
  <FontAwesome name="bars" size={36} color="#D1D5DB" />
</TouchableOpacity>

    </View>
  );
};

export default ButtonFooterCom;

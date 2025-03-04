import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// Define your types
type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
};

// Define navigation types
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'> &
  DrawerNavigationProp<RootStackParamList, 'HomeScreen'>;

const ButtonFooterCom: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Single navigation hook for this component

  return (
    <View className="flex-row justify-evenly items-center bg-violet-900 p-2">
      <TouchableOpacity onPress={() => navigation.navigate('CreateForm')}>
        <FontAwesome name="plus-circle" size={38} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <FontAwesome name="home" size={38} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <FontAwesome name="bars" size={38} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default ButtonFooterCom;

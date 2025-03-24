import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '@/app/HomeScreen';
import CreateForm from './CreateForm';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import Template4 from './Template4';
import Template5 from './Template5';
import Surveyor from '@/app/Surveyor';
import InviteAddScreen from './InviteAddScreen';
//import Drawer from '@/app/Drawer';

// Define types for your stack navigator screens
export type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
  Template1: undefined;
  Template2: undefined;
  Template3: undefined;
  Template4: undefined;
  Template5: undefined;
  Surveyor: undefined;
  Drawer: undefined;
  InviteAddScreen: undefined;
};

// Create the native stack navigator using the defined types
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Drawer Navigator for screens with a drawer menu
const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="HomeScreen" component={HomeScreen} />
  </Drawer.Navigator>
);

// Stack Navigator that includes both the drawer and the other screens
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        {/* Drawer as one of the stack screens */}
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        
        {/* Other stack screens */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CreateForm" component={CreateForm} />
        <Stack.Screen name="Template1" component={Template1} />
        <Stack.Screen name="Template2" component={Template2} />
        <Stack.Screen name="Template3" component={Template3} />
        <Stack.Screen name="Template4" component={Template4} />
        <Stack.Screen name="Template5" component={Template5} />
        <Stack.Screen name="Surveyor" component={Surveyor} />
        <Stack.Screen name="InviteAddScreen" component={InviteAddScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

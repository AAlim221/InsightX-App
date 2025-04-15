import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/app/HomeScreen';
import CreateForm from './CreateForm';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import Template4 from './Template4';
import Template5 from './Template5';
import ResearcherDashboard from "@/app/ResearcherDashboard"
import SurveyorRegister from './SurveyorRegister';
import SurveyorLogin from '@/app/SurveyorLogin';
import SettingsMenu from "@/app/SettingsMenu";
import ProfileMenu from "@/app/ProfileMenu";
import InviteSelfServeyor from '@/app/InviteSelfServeyor';
import Profile from './Profile';
import SurveyorDashboard from '@/app/SurveyorDashboard';
import ResponseQuestion from '@/app/ResponseQuestion';
import SurveyorList from './SurveyorList';
import ResponseAnalysis from "@/app/ResponseAnalysis"
// Define types for your stack navigator screens
export type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
  Template1: undefined;
  Template2: undefined;
  Template3: undefined;
  Template4: undefined;
  Template5: undefined;
  ResearcherDashboard: undefined;
  SurveyorDashboard: undefined;
  SettingsMenu: undefined;
  SurveyorRegister: undefined;
  SurveyorLogin: undefined;
  ProfileMenu: undefined;
  InviteSelfServeyor: undefined;
  Profile:undefined;
  ResponseQuestion:undefined;
  ResponseAnalysis:undefined;
  SurveyorList:undefined;

};

// Create the native stack navigator using the defined types
const Stack = createNativeStackNavigator<RootStackParamList>();
// Stack Navigator that includes both the drawer and the other screens
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>  
        {/* Other stack screens */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CreateForm" component={CreateForm} />
        <Stack.Screen name="Template1" component={Template1} />
        <Stack.Screen name="Template2" component={Template2} />
        <Stack.Screen name="Template3" component={Template3} />
        <Stack.Screen name="Template4" component={Template4} />
        <Stack.Screen name="Template5" component={Template5} />
        <Stack.Screen name="ResearcherDashboard" component={ResearcherDashboard} />
        <Stack.Screen name="SurveyorDashboard" component={SurveyorDashboard} />
        <Stack.Screen name="SurveyorRegister" component={SurveyorRegister} />
        <Stack.Screen name="SurveyorLogin" component={SurveyorLogin} />
        <Stack.Screen name="SettingsMenu" component={SettingsMenu} />
        <Stack.Screen name="ProfileMenu" component={ProfileMenu} />
        <Stack.Screen name="InviteSelfServeyor" component={InviteSelfServeyor} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SurveyorList" component={SurveyorList} />
        <Stack.Screen name="ResponseQuestion" component={ResponseQuestion} />
        <Stack.Screen name="ResponseAnalysis" component={ResponseAnalysis} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

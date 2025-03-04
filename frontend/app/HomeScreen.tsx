import React from "react";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCom from "@/components/ProfileCom";
import ButtonFooterCom from "@/components/ButtonFooterCom";
import TemplatesSectionCom from "@/components/TemplatesSectionCom";
import CategoriesCom from "@/components/CategoriesCom";
import SearchBarCom from "@/components/SearchBarCom";

// Define your types
type RootStackParamList = {
  HomeScreen: undefined;
  CreateForm: undefined;
};

const TemplateList: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header Section */}
      <View className="px-4 pt-6 flex-row justify-between items-center">
        {/* App Logo */}
        <Image
          source={require('../assets/images/AppLogo.png')} // Adjust this path if necessary
          className="w-24 h-10"
          resizeMode="contain"
        />
        {/* Profile Icon */}
        <ProfileCom />
      </View>
      {/* Search Section */}
      <SearchBarCom />
      {/* Categories Section */}
      <CategoriesCom />
      {/* Templates Section */}
      <TemplatesSectionCom />
      {/* ButtonFooterCom */}
      <ButtonFooterCom />
    </SafeAreaView>
  );
};

export default TemplateList;

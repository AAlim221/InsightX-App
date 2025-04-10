import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCom from '@/components/ProfileCom';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const SettingsMenu = (props: any) => {
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Profile', route: 'ProfileMenu' },
    { label: 'Add Surveyor', route: 'InviteAddScreen' },
    { label: 'Settings', route: 'Settings' },
    { label: 'Notifications', route: 'Notifications' },
    { label: 'Mail Support', route: 'MailSupport' },
    { label: 'Call Support', route: 'CallSupport' },
    { label: 'FAQ Videos', route: 'FAQVideos' },
    { label: 'FAQ Questions', route: 'FAQQuestions' },
    { label: 'Language', route: 'Language' },
    { label: 'Privacy Policy', route: 'PrivacyPolicy' },
    { label: 'Follow Us', route: 'FollowUs' },
    { label: 'Delete Account', route: 'DeleteAccount' },
  ];

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView className="px-4 py-6 space-y-3 bg-purple-500 w-full">
        {/* Profile Component at the top */}
        <View className="flex-row justify-between items-center gap-4 mb-4">
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          {/* User Profile Icon */}
          <ProfileCom />
        </View>
        
        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm mb-3"
            onPress={() => navigation.navigate(item.route as never)}
          >
            <Text className="text-base text-gray-800">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

export default SettingsMenu;

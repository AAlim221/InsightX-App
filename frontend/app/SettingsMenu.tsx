import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ProfileCom from '@/components/ProfileCom';

const SettingsMenu = (props: any) => {
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Profile', icon: 'person-outline', route: 'Profile' },
    { label: 'Add Surveyor', icon: 'person-add-outline', route: 'SurveyorRegister' },
    { label: 'Surveyor Dashboard', icon: 'speedometer-outline', route: 'SurveyorDashboard' },
    { label: 'Researcher Dashboard', icon: 'analytics-outline', route: 'ResearcherDashboard' },
    { label: 'Response Questions', icon: 'clipboard-outline', route: 'ResponseQuestion' }, // ✅ Added
    { label: 'Notifications', icon: 'notifications-outline', route: 'Notifications' },
    { label: 'Mail Support', icon: 'mail-outline', route: 'MailSupport' },
    { label: 'Call Support', icon: 'call-outline', route: 'CallSupport' },
    { label: 'FAQ Videos', icon: 'videocam-outline', route: 'FAQVideos' },
    { label: 'FAQ Questions', icon: 'help-circle-outline', route: 'FAQQuestions' },
    { label: 'Language', icon: 'language-outline', route: 'Language' },
    { label: 'Privacy Policy', icon: 'document-text-outline', route: 'PrivacyPolicy' },
    { label: 'Follow Us', icon: 'share-social-outline', route: 'FollowUs' },
    { label: 'Delete Account', icon: 'trash-outline', route: 'DeleteAccount' },
  ];

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: '#A020F0' }}>
      <SafeAreaView className="px-4 py-6 space-y-4 bg-purple-600 rounded-3xl">
        <View className="px-4 py-6 space-y-4 bg-violet-500 rounded-3xl">
          {/* Top Header with Back Button and Profile */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            <ProfileCom />
          </View>
          <Text className="text-white text-xl font-semibold mt-4">Settings Menu</Text>
        </View>

        <View className="px-4 mt-4 space-y-3">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white p-4 rounded-2xl shadow shadow-purple-200 flex-row items-center gap-3 mb-4"
              onPress={() => navigation.navigate(item.route as never)}
            >
              <Ionicons name={item.icon as any} size={22} color="#6B21A8" />
              <Text className="text-gray-800 text-base font-medium">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

export default SettingsMenu;

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
          <Text>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Settings')}>
          <Text>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Notifications')}>
          <Text>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('MailSupport')}>
          <Text>Mail Support</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('CallSupport')}>
          <Text>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('FAQVideos')}>
          <Text>FAQ Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('FAQQuestions')}>
          <Text>FAQ Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('Language')}>
          <Text>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('PrivacyPolicy')}>
          <Text>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('FollowUs')}>
          <Text>Follow Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('DeleteAccount')}>
          <Text>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCom from '@/components/ProfileCom';

// Type definition for form structure
type FormType = {
  id: string;
  title: string;
  field1?: string;
  field2?: string;
  [key: string]: any;
};

const ResearcherDashboard = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load forms on mount
  useEffect(() => {
    axios
      .get('http://192.168.0.183:8082/api/v1/form/listAllForms')
      .then((response) => {
        setForms(response.data);
      })
      .catch((error) => {
        console.error('Error loading forms:', error);
        Alert.alert('Error', 'Failed to load forms from the server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBoxPress = (form: FormType) => {
    setSelectedForm({
      ...form,
      field1: form?.field1 || '',
      field2: form?.field2 || '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;

    try {
      const response = await axios.post(
        'http://192.168.0.183:8082/api/v1/auth/createForm',
        selectedForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Form submitted successfully.');
        setModalVisible(false);
      } else {
        Alert.alert('Failed', `Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit the form.');
    }
  };

  const confirmSubmit = () => {
    Alert.alert('Confirm', 'Do you want to submit this form?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', onPress: handleSubmit },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-purple-500 flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <ProfileCom />
      </View>

      {/* Researcher Info */}
      <View className="bg-purple-500">
        <View className="bg-white py-4 mb-4">
          <Text className="text-center text-black font-semibold text-lg">Researcher Name</Text>
        </View>
        <View className="bg-white py-4 mb-4">
          <Text className="text-center text-black font-semibold text-lg">Researcher ID</Text>
        </View>
        <TouchableOpacity className="bg-white py-4 mb-4">
          <Text className="text-center text-black font-semibold text-lg">Work On Template</Text>
        </TouchableOpacity>
      </View>

      {/* Forms List */}
      <ScrollView className="bg-purple-500 px-4 flex-1">
        {loading ? (
          <ActivityIndicator size="large" color="#fff" className="my-8" />
        ) : forms.length === 0 ? (
          <Text className="text-white text-center mt-4">No forms available.</Text>
        ) : (
          forms.map((form: FormType, index: number) => (
            <TouchableOpacity
              key={form.id || index}
              className="bg-gray-400 h-24 my-2 rounded-lg justify-center items-center"
              onPress={() => handleBoxPress(form)}
            >
              <Text className="text-white font-semibold text-base">
                {form.title || `Form ${index + 1}`}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for form view and input */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-black bg-opacity-70 px-4">
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-lg font-bold mb-2 text-center">
              {selectedForm?.title || 'Form Details'}
            </Text>
            <ScrollView>
              <TextInput
                placeholder="Field 1"
                value={selectedForm?.field1}
                onChangeText={(text) =>
                  setSelectedForm((prev) => ({
                    ...(prev as FormType),
                    field1: text,
                  }))
                }
                className="border mb-2 p-2 rounded"
              />
              <TextInput
                placeholder="Field 2"
                value={selectedForm?.field2}
                onChangeText={(text) =>
                  setSelectedForm((prev) => ({
                    ...(prev as FormType),
                    field2: text,
                  }))
                }
                className="border mb-4 p-2 rounded"
              />
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="bg-green-500 px-4 py-2 rounded"
                  onPress={confirmSubmit}
                >
                  <Text className="text-white font-bold">Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 px-4 py-2 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-bold">Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View className="flex-row bg-purple-900 py-4 justify-between px-8">
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Ionicons name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/SettingsMenu')}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResearcherDashboard;

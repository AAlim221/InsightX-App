// 📁 components/EditSurveyor.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditSurveyor = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    gmail: '',
    surveyorID: '',
    mobileNo: '',
    nidOrPassport: '',
  });

  const fetchSurveyor = async () => {
    try {
      const { data } = await axios.get(`http://192.168.0.183:8082/api/v1/auth/surveyors/${id}`);
      setForm(data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch surveyor data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      await axios.put(`http://192.168.0.183:8082/api/v1/auth/surveyors/${id}`, form);
      Alert.alert('Success', 'Surveyor updated successfully');
      router.push('/SurveyorList');
    } catch (err) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSurveyor();
  }, []);

  if (loading) return <ActivityIndicator size="large" className="mt-20" color="purple" />;

  return (
    <SafeAreaView className="flex-1 bg-purple-50 px-4 py-6">
      <Text className="text-2xl font-bold text-purple-800 mb-4">Edit Surveyor</Text>
      {Object.keys(form).map((key, index) => (
        <TextInput
          key={index}
          placeholder={key}
          placeholderTextColor="gray"
          className="bg-white p-3 mb-3 rounded-lg text-black"
          value={form[key]}
          onChangeText={(text) => setForm({ ...form, [key]: text })}
        />
      ))}
      <TouchableOpacity
        className="bg-purple-600 py-3 mt-4 rounded-xl"
        onPress={handleUpdate}
        disabled={submitting}
      >
        <Text className="text-white text-center font-bold">
          {submitting ? 'Updating...' : 'Update'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditSurveyor;

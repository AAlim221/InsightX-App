import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, ActivityIndicator, Alert, TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Type definitions
type Surveyor = {
  _id: string;
  name: string;
  gmail: string;
  surveyorID: string;
  mobileNo: string;
  nidOrPassport: string;
};

const SurveyorList: React.FC = () => {
  const router = useRouter();
  const [surveyors, setSurveyors] = useState<Surveyor[]>([]);
  const [filtered, setFiltered] = useState<Surveyor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSurveyors = async () => {
    try {
      const { data } = await axios.get('http://192.168.0.183:8082/api/v1/auth/surveyors');
      setSurveyors(data.data);
      setFiltered(data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch surveyors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    Alert.alert("Confirm", "Delete this surveyor?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            await axios.delete(`http://192.168.0.183:8082/api/v1/auth/surveyors/${id}`);
            fetchSurveyors();
          } catch (err) {
            Alert.alert("Error", "Failed to delete surveyor");
          }
        }
      }
    ]);
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
    const filteredData = surveyors.filter((s) =>
      s.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  useEffect(() => {
    fetchSurveyors();
  }, []);

  const renderItem = ({ item }: { item: Surveyor }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-md">
      <Text className="text-lg font-semibold text-purple-800">{item.name}</Text>
      <Text className="text-sm text-gray-600">Gmail: {item.gmail}</Text>
      <Text className="text-sm text-gray-600">Mobile: {item.mobileNo}</Text>
      <View className="flex-row justify-end mt-2 space-x-3">
        <TouchableOpacity onPress={() => router.push({ pathname: '/EditSurveyor', params: { id: item._id } })}>
          <Ionicons name="create-outline" size={22} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-purple-50 px-4 py-2">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-purple-900">Surveyor List</Text>
        <TouchableOpacity onPress={() => fetchSurveyors()}>
          <Ionicons name="refresh-outline" size={24} color="purple" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search by name"
        placeholderTextColor="gray"
        className="bg-white p-3 mb-4 rounded-lg text-black shadow"
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6B21A8" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

export default SurveyorList;

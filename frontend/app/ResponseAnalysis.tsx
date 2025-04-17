import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import MapView, { Marker } from 'react-native-maps';

const screenWidth = Dimensions.get('window').width;

// Chart Data
const surveyCategoryData = [
  { name: 'Customer Feedback', population: 35, color: '#4CAF50', legendFontColor: '#000', legendFontSize: 12 },
  { name: 'Market Research', population: 25, color: '#FF9800', legendFontColor: '#000', legendFontSize: 12 },
  { name: 'Demographics', population: 20, color: '#F44336', legendFontColor: '#000', legendFontSize: 12 },
  { name: 'Other', population: 20, color: '#03A9F4', legendFontColor: '#000', legendFontSize: 12 },
];

const questionTypeData = [
  { name: 'Multiple Choice', population: 52.3, color: '#4CAF50', legendFontColor: '#000', legendFontSize: 12 },
  { name: 'Text', population: 33.4, color: '#FF9800', legendFontColor: '#000', legendFontSize: 12 },
  { name: 'Other', population: 12.3, color: '#9C27B0', legendFontColor: '#000', legendFontSize: 12 },
];

const surveySummaryData = [
  { name: 'Customer Feedback Survey', created: '2019-03-24', pages: 2, questions: 10, completed: '100%', time: '5.02' },
  { name: 'Customer Satisfaction Survey', created: '2019-12-09', pages: 1, questions: 5, completed: '100%', time: '2.83' },
];

const initialSurveyors = [
  { id: '1', name: 'A.Alim', location: { latitude: 23.8103, longitude: 90.4125 } },
  { id: '2', name: 'Mahdea', location: { latitude: 23.7521, longitude: 90.3800 } },
];

const infoTiles = [
  { label: 'Surveys', value: '12' },
  { label: 'Collectors', value: '23' },
  { label: 'Responses', value: '0.87K' },
  { label: 'Partial Responses', value: '113' },
  { label: 'Avg Time (min)', value: '5.04' },
  { label: 'Completion Rate', value: '95%' },
];

const ResponseAnalysis = () => {
  const [selectedSurveyor, setSelectedSurveyor] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [surveyors, setSurveyors] = useState(initialSurveyors);

  const addSurveyor = () => {
    if (newName.trim()) {
      const newSurveyor = {
        id: Date.now().toString(),
        name: newName,
        location: { latitude: 23.78, longitude: 90.4 },
      };
      setSurveyors([...surveyors, newSurveyor]);
      setNewName('');
      setModalVisible(false);
    }
  };

  const deleteSurveyor = (id: string) => {
    setSurveyors(surveyors.filter(s => s.id !== id));
  };

  return (
    <ScrollView className="bg-white flex-1 p-4">
      {/* Dashboard Header */}
      <View className="items-center mt-16">
        <Text className="text-3xl font-bold text-green-700 mb-8">Survey Dashboard</Text>
      </View>

      {/* Info Tiles */}
      <View className="flex-row flex-wrap justify-between mb-6">
        {infoTiles.map((item, idx) => (
          <View key={idx} className="w-[48%] bg-gray-100 p-3 rounded-lg mb-3 shadow-sm">
            <Text className="text-gray-700 text-sm">{item.label}</Text>
            <Text className="text-black text-xl font-bold">{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Pie Chart Blocks */}
      <View className="mb-6">
        {/* Chart Block 1 */}
        <View className="bg-white rounded-xl p-4 shadow-md mb-4">
          <Text className="text-lg font-semibold text-black mb-2">📊 Surveys by Category</Text>
          <PieChart
            data={surveyCategoryData}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              color: () => `black`,
              labelColor: () => '#000',
              propsForLabels: { fontSize: 12 },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[5, 0]}
            absolute
          />
        </View>

        {/* Chart Block 2 */}
        <View className="bg-white rounded-xl p-4 shadow-md">
          <Text className="text-lg font-semibold text-black mb-2">📈 Question Type Distribution</Text>
          <PieChart
            data={questionTypeData}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              color: () => `black`,
              labelColor: () => '#000',
              propsForLabels: { fontSize: 12 },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[5, 0]}
            absolute
          />
        </View>
      </View>

      {/* Survey Summary Table */}
      <Text className="text-lg font-semibold text-black mb-2">Survey Summary</Text>
      <View className="bg-gray-100 rounded-lg mb-6">
        <View className="flex-row justify-between p-2 bg-gray-200">
          <Text className="w-[35%] font-bold text-sm text-black">Survey</Text>
          <Text className="w-[20%] font-bold text-sm text-black">Created</Text>
          <Text className="w-[10%] font-bold text-sm text-black">Pg</Text>
          <Text className="w-[10%] font-bold text-sm text-black">Qns</Text>
          <Text className="w-[10%] font-bold text-sm text-black">Comp</Text>
          <Text className="w-[10%] font-bold text-sm text-black">Time</Text>
        </View>
        {surveySummaryData.map((item, index) => (
          <View key={index} className="flex-row justify-between p-2 border-b border-gray-300">
            <Text className="w-[35%] text-sm">{item.name}</Text>
            <Text className="w-[20%] text-sm">{item.created}</Text>
            <Text className="w-[10%] text-sm">{item.pages}</Text>
            <Text className="w-[10%] text-sm">{item.questions}</Text>
            <Text className="w-[10%] text-sm">{item.completed}</Text>
            <Text className="w-[10%] text-sm">{item.time}</Text>
          </View>
        ))}
      </View>

      {/* Surveyor Filter */}
      <Text className="text-lg font-semibold text-black mb-2">Filter by Surveyor</Text>
      <ScrollView horizontal className="mb-4">
        {surveyors.map(s => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setSelectedSurveyor(s.id)}
            className={`px-3 py-1 rounded-full mr-2 ${selectedSurveyor === s.id ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <Text className={`${selectedSurveyor === s.id ? 'text-white' : 'text-black'}`}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Surveyor List */}
      <Text className="text-lg font-semibold text-black mb-2">Surveyor List</Text>
      <FlatList
        data={surveyors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-3 border rounded-lg mb-2">
            <Text className="text-black">{item.name}</Text>
            <TouchableOpacity onPress={() => deleteSurveyor(item.id)}>
              <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Surveyor */}
      <TouchableOpacity
        className="bg-green-500 py-3 rounded-lg items-center mt-4 mb-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold">➕ Add Surveyor</Text>
      </TouchableOpacity>

      {/* Map View */}
      <Text className="text-lg font-semibold text-black mb-2">🗺️ Surveyor Locations</Text>
      <MapView
        style={{ height: 200, borderRadius: 12 }}
        initialRegion={{
          latitude: 23.8103,
          longitude: 90.4125,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {surveyors.map(s => (
          <Marker key={s.id} coordinate={s.location} title={s.name} />
        ))}
      </MapView>

      {/* Add Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-4/5">
            <Text className="text-lg font-bold mb-2 text-black">Add New Surveyor</Text>
            <TextInput
              placeholder="Enter Name"
              value={newName}
              onChangeText={setNewName}
              className="border p-2 rounded mb-4 text-black"
            />
            <TouchableOpacity className="bg-blue-500 py-2 rounded items-center" onPress={addSurveyor}>
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="mt-3 items-center">
              <Text className="text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>

  );
};

export default ResponseAnalysis;

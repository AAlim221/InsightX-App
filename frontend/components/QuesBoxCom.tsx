import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownCom from'@/components/DropDownCom'
const QuesBoxCom = () => {
  const [isRequired, setIsRequired] = useState(false);

  return (
    <SafeAreaView>
      {/* Question Section */}
      <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <TextInput
          placeholder="Write Question here"
          className="text-black text-xl font-bold"
        />
      </View>
      {/* Options And Dropdown  Section */}
        <DropDownCom/>
      {/* Required Toggle */}
      <View className="mt-4 flex-row justify-between items-center">
        <MaterialIcons name="content-copy" size={24} color="black" />
        <View className="flex-row items-center space-x-2">
          <Text className="text-slate-900 font-bold">Required</Text>
          <Switch
            value={isRequired}
            onValueChange={setIsRequired}
            trackColor={{ true: '#69fffd', false: '#ccc' }}
          />
        </View>
        <TouchableOpacity>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuesBoxCom;

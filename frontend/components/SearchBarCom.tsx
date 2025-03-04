import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

const SearchBarCom = () => {
  return (
    // Search Section
    <View className="px-4 pt-4">
      <Text className="text-white text-2xl font-bold">Search</Text>
      <Text className="text-pink-400 text-2xl font-bold">Templates</Text>
      <View className="flex-row items-center mt-4">
        <TextInput
          className="flex-1 bg-white text-black px-4 py-4 rounded-lg"
          placeholder="Search here"
        />
        <TouchableOpacity className="ml-2 bg-yellow-300 p-3 rounded-lg">
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchBarCom;

import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CategoriesCom = () => {
  return (
    <View className="px-4 mt-6">
      {/* Categories Section */}
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-xl font-bold">Categories</Text>
        <TouchableOpacity>
          <Text className="text-pink-400 text-lg font-bold">More</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mt-4">
        {/* Categories - Clickable Links */}
        <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
        <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
        <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
        <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
        <TouchableOpacity className="bg-purple-500 w-12 h-12 rounded-lg mr-2"></TouchableOpacity>
      </View>
    </View>
  )
}

export default CategoriesCom;

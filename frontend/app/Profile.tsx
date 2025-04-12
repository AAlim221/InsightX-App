import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const Profile = () => {
  const handleEdit = () => {
    // Navigation or modal logic goes here
    console.log('Edit profile')
  }

  const handleDelete = () => {
    // Confirmation or API call goes here
    console.log('Delete profile')
  }

  return (
    <View className="flex-1 bg-white p-6">
      {/* Profile Header */}
      <View className="items-center mt-10">
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          className="w-28 h-28 rounded-full border-4 border-blue-500"
        />
        <Text className="text-2xl font-bold mt-4 text-gray-800">Shubho Kumar Dey</Text>
        <Text className="text-sm text-gray-500 mt-1">shubho@example.com</Text>
      </View>

      {/* Profile Details */}
      <View className="mt-8 space-y-4">
        <View className="bg-blue-50 p-4 rounded-xl shadow-sm">
          <Text className="text-gray-700 font-semibold">Phone</Text>
          <Text className="text-gray-600">+880 1234 567890</Text>
        </View>

        <View className="bg-blue-50 p-4 rounded-xl shadow-sm">
          <Text className="text-gray-700 font-semibold">Address</Text>
          <Text className="text-gray-600">Dhaka, Bangladesh</Text>
        </View>

        <View className="bg-blue-50 p-4 rounded-xl shadow-sm">
          <Text className="text-gray-700 font-semibold">Date of Birth</Text>
          <Text className="text-gray-600">January 1, 1990</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around mt-10">
        <TouchableOpacity
          onPress={handleEdit}
          className="bg-green-500 px-6 py-3 rounded-xl shadow-md"
        >
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 px-6 py-3 rounded-xl shadow-md"
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile

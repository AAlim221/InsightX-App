import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropdownMenu = () => {
  const [selectedOption, setSelectedOption] = useState("Multiple choice");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const options = [
    "Short answer",
    "Paragraph",
    "Multiple choice",
    "Checkboxes",
    "Linear scale",
    "Rating",
    "Multiple choice grid",
    "Checkbox grid",
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownVisible(false);
  };

  return (
    <View className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
      {/* Dropdown trigger */}
      <TouchableOpacity
        onPress={() => setIsDropdownVisible(true)}
        className="flex-row items-center justify-between"
      >
        <Text className="text-black font-bold">{selectedOption}</Text>
        <Ionicons name="chevron-down" size={24} color="black" />
      </TouchableOpacity>

      {/* Modal for dropdown options */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPressOut={() => setIsDropdownVisible(false)}
        >
          <View className="absolute right-8 top-24 bg-white p-4 rounded-lg shadow-lg">
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleOptionSelect(item)}
                  className="p-2"
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Options Section */}
      <View>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="radio-button-off" size={24} color="black" />
          <Text className="ml-2 text-black">Add Option</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="radio-button-off" size={24} color="black" />
          <Text className="ml-2 text-black">Add Option</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="radio-button-off" size={24} color="black" />
          <Text className="ml-2 text-black">Add Option</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="radio-button-off" size={24} color="black" />
          <Text className="ml-2 text-black">Add Option</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DropdownMenu;

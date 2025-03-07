import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropdownMenu = () => {
  const [selectedOption, setSelectedOption] = useState("Multiple choice");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [options, setOptions] = useState([
    "Short answer",
    "Paragraph",
    "Multiple choice",
    "Checkboxes",
    "Linear scale",
    "Rating",
    "Multiple choice grid",
    "Checkbox grid",
  ]);

  // MCQ & Checkbox Data
  const [mcqOptions, setMcqOptions] = useState([""]);
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [checkboxSelected, setCheckboxSelected] = useState<number[]>([]);

  // Linear Scale Data
  const [linearScale, setLinearScale] = useState({ min: 1, max: 5 });
  const [selectedScale, setSelectedScale] = useState<number | null>(null);

  // Grid Data
  const [gridRows, setGridRows] = useState(["Row 1"]);
  const [gridColumns, setGridColumns] = useState(["Col 1"]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownVisible(false);
    setMcqOptions([""]); // Reset MCQ options on type change
  };

  const handleAddOption = () => {
    setMcqOptions([...mcqOptions, ""]);
  };

  const handleMcqChange = (text: string, index: number) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions[index] = text;
    setMcqOptions(updatedOptions);
  };

  const handleCheckboxToggle = (index: number) => {
    if (checkboxSelected.includes(index)) {
      setCheckboxSelected(checkboxSelected.filter((item) => item !== index));
    } else {
      setCheckboxSelected([...checkboxSelected, index]);
    }
  };

  const handleAddRow = () => {
    setGridRows([...gridRows, `Row ${gridRows.length + 1}`]);
  };

  const handleAddColumn = () => {
    setGridColumns([...gridColumns, `Col ${gridColumns.length + 1}`]);
  };

  return (
    <ScrollView className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
      {/* Dropdown Trigger */}
      <TouchableOpacity
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        className="flex-row items-center justify-between"
      >
        <Text className="text-black font-bold">{selectedOption}</Text>
        <Ionicons name={isDropdownVisible ? "chevron-up" : "chevron-down"} size={24} color="black" />
      </TouchableOpacity>

      {/* Dropdown List */}
      {isDropdownVisible && (
        <View className="bg-white mt-2 p-2 rounded-lg shadow-lg border border-gray-200">
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
      )}

      {/* Input Fields Based on Selected Type */}
      <View>
        {selectedOption === "Short answer" && (
          <TextInput placeholder="Short answer text" className="border-b border-gray-400 text-black" />
        )}

        {selectedOption === "Paragraph" && (
          <TextInput placeholder="Paragraph text" multiline className="border border-gray-400 p-2 rounded-lg text-black" />
        )}

        {/* Multiple Choice / Checkboxes */}
        {(selectedOption === "Multiple choice" || selectedOption === "Checkboxes") && (
          <View>
            {mcqOptions.map((option, index) => (
              <View key={index} className="flex-row items-center mt-2">
                <TouchableOpacity onPress={() => (selectedOption === "Multiple choice" ? setSelectedMcq(index) : handleCheckboxToggle(index))}>
                  <Ionicons
                    name={selectedOption === "Multiple choice"
                      ? selectedMcq === index ? "radio-button-on" : "radio-button-off"
                      : checkboxSelected.includes(index) ? "checkbox" : "square-outline"
                    }
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
                <TextInput
                  value={option}
                  onChangeText={(text) => handleMcqChange(text, index)}
                  placeholder="Option text"
                  className="ml-2 border-b border-gray-400 flex-1 text-black"
                />
              </View>
            ))}
            <TouchableOpacity onPress={handleAddOption} className="flex-row items-center mt-2">
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Option</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Linear Scale */}
        {selectedOption === "Linear scale" && (
          <View>
            <View className="flex-row items-center space-x-4">
              <Text>Min:</Text>
              <TextInput
                keyboardType="numeric"
                value={String(linearScale.min)}
                onChangeText={(text) => setLinearScale({ ...linearScale, min: Number(text) })}
                className="border-b border-gray-400 text-black w-10 text-center"
              />
              <Text>to</Text>
              <TextInput
                keyboardType="numeric"
                value={String(linearScale.max)}
                onChangeText={(text) => setLinearScale({ ...linearScale, max: Number(text) })}
                className="border-b border-gray-400 text-black w-10 text-center"
              />
            </View>
            <View className="flex-row mt-3 space-x-2">
              {Array.from({ length: linearScale.max - linearScale.min + 1 }, (_, i) => i + linearScale.min).map((num) => (
                <TouchableOpacity key={num} onPress={() => setSelectedScale(num)}>
                  <Ionicons name={selectedScale === num ? "radio-button-on" : "radio-button-off"} size={24} color="black" />
                  <Text>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Multiple Choice Grid / Checkbox Grid */}
        {(selectedOption === "Multiple choice grid" || selectedOption === "Checkbox grid") && (
          <View>
            <Text className="font-bold">Grid Rows</Text>
            {gridRows.map((row, index) => (
              <TextInput key={index} value={row} className="border-b border-gray-400 text-black mt-1" />
            ))}
            <TouchableOpacity onPress={handleAddRow} className="flex-row items-center mt-2">
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Row</Text>
            </TouchableOpacity>

            <Text className="font-bold mt-4">Grid Columns</Text>
            {gridColumns.map((col, index) => (
              <TextInput key={index} value={col} className="border-b border-gray-400 text-black mt-1" />
            ))}
            <TouchableOpacity onPress={handleAddColumn} className="flex-row items-center mt-2">
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Column</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DropdownMenu;

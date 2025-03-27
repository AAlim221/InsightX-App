import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define the type for the props that are passed to DropdownCom component
interface DropdownComProps {
  onTypeChange: (index: number, option: string) => void; // Accept index and option
  index: number; // Add index to the props
  type: string; // Accept type of the question as a prop
}

const DropdownCom: React.FC<DropdownComProps> = ({ onTypeChange, index, type }) => {
  const [selectedOption, setSelectedOption] = useState(type);  // Initialize with type prop
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [options] = useState([
    "short-answer",
    "paragraph",
    "multiple-choice",
    "checkboxes",
    "linear-scale",
    "rating",
    "multiple-choice-grid",
    "checkbox-grid"
  ]);

  // MCQ & Checkbox Data
  const [mcqOptions, setMcqOptions] = useState([""]);
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [checkboxSelected, setCheckboxSelected] = useState<number[]>([]);

  // Linear Scale Data
  const [linearScale, setLinearScale] = useState({ min: 1, max: 5 });
  const [selectedScale, setSelectedScale] = useState<number | null>(null);

  // Grid Data
  const [gridRows, setGridRows] = useState([""]);
  const [gridColumns, setGridColumns] = useState([""]);

  // Handle option select and update state
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownVisible(false);
  
    // Reset based on the selected question type
    if (option === "multiple-choice" || option === "checkboxes") {
      // Reset MCQ options but preserve the initial structure
      setMcqOptions([""]);
    } else if (option === "multiple-choice-grid" || option === "checkbox-grid") {
      // Reset grid rows and columns but keep an initial setup
      setGridRows([""]);
      setGridColumns([""]);
    } else {
      // Default reset for other types
      setMcqOptions([]);
      setGridRows([]);
      setGridColumns([]);
    }
  
    // Trigger the type change in the parent
    onTypeChange(index, option);
  };
  return (
    <View className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
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
    </View>
  );
};

export default DropdownCom;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons, } from "@expo/vector-icons";
import axios from "axios";

const DropdownMenu = () => {
  const [selectedOption, setSelectedOption] = useState("Multiple choice");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [options] = useState([
    "Short answer",
    "Paragraph",
    "Multiple choice",
    "Checkboxes",
    "Linear scale",
    "Rating",
    "Multiple choice grid",
    "Checkbox grid",
  ]);

  const [question, setQuestion] = useState("");
  const [isRequired, setIsRequired] = useState(false);

  // Multiple choice & Checkboxes
  const [mcqOptions, setMcqOptions] = useState([""]);
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [checkboxSelected, setCheckboxSelected] = useState<number[]>([]);

  // Linear Scale
  const [linearScale, setLinearScale] = useState({ min: 1, max: 5 });
  const [selectedScale, setSelectedScale] = useState<number | null>(null);

  // Grid-based questions
  const [gridRows, setGridRows] = useState(["Row 1"]);
  const [gridColumns, setGridColumns] = useState(["Col 1"]);

  // Star Rating
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const maxRating = 5;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownVisible(false);
  };

  const handleAddOption = () => setMcqOptions([...mcqOptions, ""]);

  const handleAddRow = () => setGridRows([...gridRows, `Row ${gridRows.length + 1}`]);
  const handleAddColumn = () => setGridColumns([...gridColumns, `Col ${gridColumns.length + 1}`]);

  const submitSurveyResponse = async () => {
    const surveyData = {
      question,
      selectedOption,
      isRequired,
      mcqOptions,
      selectedMcq,
      checkboxSelected,
      linearScale,
      selectedScale,
      gridRows,
      gridColumns,
      selectedRating,
    };

    try {
      const response = await axios.post("http://192.168.0.189:8082/api/v1/auth/create", surveyData);
      console.log("Survey response submitted:", response.data);
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  return (
    <View className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
      <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <TextInput
          placeholder="Write Question here"
          className="text-black text-xl font-bold"
          value={question}
          onChangeText={setQuestion}
        />
      </View>

      {/* Dropdown Menu */}
      <TouchableOpacity onPress={() => setIsDropdownVisible(!isDropdownVisible)} 
      className="flex-row items-center justify-between">
        <Text className="text-black bg-slate-50 font-bold">{selectedOption}</Text>
        <Ionicons name={isDropdownVisible ? "chevron-up" : "chevron-down"} size={24} color="black" />
      </TouchableOpacity>

      {isDropdownVisible && (
        <View className="bg-white mt-2 p-2 rounded-lg shadow-lg border border-gray-200">
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOptionSelect(item)} className="p-2">
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Dynamic UI based on selection */}
      <View className="bg-slate-50">
        {selectedOption === "Short answer" && (
          <TextInput placeholder="Short answer text" className="border-b border-gray-400 text-black" />
        )}

        {selectedOption === "Paragraph" && (
          <TextInput placeholder="Paragraph text" multiline className="border border-gray-400 p-2 rounded-lg text-black" />
        )}

        {(selectedOption === "Multiple choice" || selectedOption === "Checkboxes") && (
          <View className="bg-slate-50">
            {mcqOptions.map((option, index) => (
              <View key={index} className="flex-row items-center mt-2">
                <TouchableOpacity onPress={() =>
                  selectedOption === "Multiple choice"
                    ? setSelectedMcq(index)
                    : checkboxSelected.includes(index)
                    ? setCheckboxSelected(checkboxSelected.filter((item) => item !== index))
                    : setCheckboxSelected([...checkboxSelected, index])
                }>
                  <Ionicons
                    name={selectedOption === "Multiple choice"
                      ? selectedMcq === index ? "radio-button-on" : "radio-button-off"
                      : checkboxSelected.includes(index) ? "checkbox" : "square-outline"}
                    size={24} color="black"
                  />
                </TouchableOpacity>
                <TextInput value={option} onChangeText={(text) => {
                  const updatedOptions = [...mcqOptions];
                  updatedOptions[index] = text;
                  setMcqOptions(updatedOptions);
                }} placeholder="Option text" className="ml-2 border-b border-gray-400 flex-1 text-black" />
              </View>
            ))}
            <TouchableOpacity onPress={handleAddOption} className="flex-row items-center mt-2">
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Option</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedOption === "Linear scale" && (
          <View className="mt-2">
            <Text className="text-black">Select a scale from {linearScale.min} to {linearScale.max}</Text>
            <View className="flex-row space-x-2 mt-2">
              {Array.from({ length: linearScale.max - linearScale.min + 1 }, (_, i) => i + linearScale.min).map((num) => (
                <TouchableOpacity key={num} onPress={() => setSelectedScale(num)}>
                  <Text className={`p-2 rounded-full ${selectedScale === num ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedOption === "Rating" && (
          <View className="mt-2 flex-row">
            {[...Array(maxRating)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedRating(index + 1)}>
                <Ionicons name={selectedRating && selectedRating > index ? "star" : "star-outline"} size={24} color="gold" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {selectedOption.includes("grid") && (
          <View>
            <Text className="font-bold text-black">Rows</Text>
            {gridRows.map((row, index) => <Text key={index}>{row}</Text>)}
            <TouchableOpacity onPress={handleAddRow}><Text>Add Row</Text></TouchableOpacity>

            <Text className="font-bold text-black mt-2">Columns</Text>
            {gridColumns.map((col, index) => <Text key={index}>{col}</Text>)}
            <TouchableOpacity onPress={handleAddColumn}><Text>Add Column</Text></TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={submitSurveyResponse} className="bg-blue-500 mt-4 p-4 rounded-lg">
        <Text className="text-center text-white font-bold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DropdownMenu;

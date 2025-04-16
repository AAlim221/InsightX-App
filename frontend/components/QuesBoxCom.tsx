import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface QuesBoxProps {
  index: number;
  question: string;
  type: string;
  options: string[];
  rows?: string[];
  columns?: string[];
  minValue?: number;
  maxValue?: number;
  onQuestionChange: (index: number, value: string) => void;
  onTypeChange: (index: number, type: string) => void;
  onOptionsChange: (index: number, options: string[]) => void;
  onGridChange?: (index: number, rows: string[], columns: string[]) => void;
  onCopyQuestion: (index: number) => void;
  onDeleteQuestion: (index: number) => void;
  onMinValueChange: (index: number, minValue: number) => void;
  onMaxValueChange: (index: number, maxValue: number) => void;
}

const QuestionBoxCom: React.FC<QuesBoxProps> = ({
  index,
  question,
  type,
  options,
  rows = [],
  columns = [],
  minValue,
  maxValue,
  onQuestionChange,
  onTypeChange,
  onOptionsChange,
  onGridChange,
  onCopyQuestion,
  onDeleteQuestion,
  onMinValueChange,
  onMaxValueChange,
}) => {
  const [isRequired, setIsRequired] = useState(false);
  const [mcqOptions, setMcqOptions] = useState(options);
  const [gridRows, setGridRows] = useState<string[]>(rows);
  const [gridColumns, setGridColumns] = useState<string[]>(columns);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const typeOptions = [
    "short-answer",
    "paragraph",
    "multiple-choice",
    "checkboxes",
    "linear-scale",
    "rating",
    "multiple-choice-grid",
    "checkbox-grid",
  ];

  const handleOptionSelect = (option: string) => {
    setDropdownVisible(false);
    setMcqOptions(option === "multiple-choice" || option === "checkboxes" ? [""] : []);
    setGridRows(option.includes("grid") ? [""] : []);
    setGridColumns(option.includes("grid") ? [""] : []);
    onTypeChange(index, option);
  };

  const handleMcqChange = (text: string, optionIndex: number) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions[optionIndex] = text;
    setMcqOptions(updatedOptions);
    onOptionsChange(index, updatedOptions);
  };

  const handleAddOption = () => {
    const updatedOptions = [...mcqOptions, ""];
    setMcqOptions(updatedOptions);
    onOptionsChange(index, updatedOptions);
  };

  const generateGridOptions = (numRows: number, numColumns: number): string[] => {
    return Array.from({ length: numRows * numColumns }, (_, i) => `Option ${i + 1}`);
  };

  const handleGridUpdate = (updatedRows: string[], updatedColumns: string[]) => {
    setGridRows([...updatedRows]);
    setGridColumns([...updatedColumns]);
    if (onGridChange) {
      onGridChange(index, [...updatedRows], [...updatedColumns]);
    }
    onOptionsChange(index, generateGridOptions(updatedRows.length, updatedColumns.length));
  };

  const handleRowChange = (text: string, rowIndex: number) => {
    const updatedRows = [...gridRows];
    updatedRows[rowIndex] = text;
    handleGridUpdate(updatedRows, gridColumns);
  };

  const handleColumnChange = (text: string, colIndex: number) => {
    const updatedColumns = [...gridColumns];
    updatedColumns[colIndex] = text;
    handleGridUpdate(gridRows, updatedColumns);
  };

  const handleAddRow = () => handleGridUpdate([...gridRows, `Row ${gridRows.length + 1}`], gridColumns);

  const handleAddColumn = () => handleGridUpdate(gridRows, [...gridColumns, `Col ${gridColumns.length + 1}`]);

  return (
    <SafeAreaView>
      <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
        {/* Question Input */}
        <TextInput
          placeholder="1. Write Question here"
          className="text-black text-xl font-bold"
          value={question}
          onChangeText={(text) => onQuestionChange(index, text)}
        />

        {/* Dropdown for Type Selection */}
        <View className="bg-white p-4 mt-4 rounded-lg space-y-3 shadow-md">
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            className="flex-row items-center justify-between"
          >
            <Text className="text-black font-bold">{type}</Text>
            <Ionicons
              name={dropdownVisible ? "chevron-up" : "chevron-down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <View className="bg-white mt-2 p-2 rounded-lg shadow-lg border border-gray-200">
              <FlatList
                data={typeOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleOptionSelect(item)}
                    className="p-2"
                  >
                    <Text className="text-black">{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Input variations based on type */}
        {type === "short-answer" && (
          <TextInput
            placeholder="Type your answer here"
            className="bg-white text-black mt-2 p-2 rounded-lg shadow-lg border border-gray-200"
            value=""
            onChangeText={() => {}}
          />
        )}

        {type === "paragraph" && (
          <TextInput
            placeholder="Type your paragraph answer here"
            className="bg-white text-black mt-2 p-2 rounded-lg shadow-lg border border-gray-200"
            multiline
            numberOfLines={4}
            value=""
            onChangeText={() => {}}
          />
        )}

        {["linear-scale", "rating"].includes(type) && (
          <View className="bg-gray-200 p-4 rounded-md mt-2">
            <Text className="text-lg font-bold">Min & Max Values</Text>
            <TextInput
              placeholder="Min Value"
              keyboardType="numeric"
              className="bg-white p-2 rounded-md mt-2"
              value={minValue ? minValue.toString() : ""}
              onChangeText={(number) => {
                onMinValueChange(index, Number(number));
              }}
            />
            <TextInput
              placeholder="Max Value"
              keyboardType="numeric"
              className="bg-white p-2 rounded-md mt-2"
              value={maxValue ? maxValue.toString() : ""}
              onChangeText={(number) => {
                onMaxValueChange(index, Number(number));
              }}
            />
          </View>
        )}

        {(type === "multiple-choice" || type === "checkboxes") && (
          <View className="mt-4">
            {mcqOptions.map((option, optionIndex) => (
              <View key={optionIndex} className="flex-row items-center mt-2">
                <Ionicons
                  name={type === "multiple-choice" ? "radio-button-off" : "checkbox-outline"}
                  size={24}
                  color="black"
                />
                <TextInput
                  value={option}
                  onChangeText={(text) => handleMcqChange(text, optionIndex)}
                  placeholder="Option text"
                  className="ml-2 border-b border-gray-400 flex-1 text-black"
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={handleAddOption}
              className="flex-row items-center mt-2"
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Option</Text>
            </TouchableOpacity>
          </View>
        )}

        {(type === "multiple-choice-grid" || type === "checkbox-grid") && (
          <View className="mt-4">
            <Text className="font-bold text-black">Grid Rows</Text>
            {gridRows.map((row, rowIndex) => (
              <TextInput
                key={rowIndex}
                value={row}
                onChangeText={(text) => handleRowChange(text, rowIndex)}
                placeholder={`Row ${rowIndex + 1}`}
                className="border-b border-gray-400 text-black mt-1"
              />
            ))}
            <TouchableOpacity
              onPress={handleAddRow}
              className="flex-row items-center mt-2"
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Row</Text>
            </TouchableOpacity>

            <Text className="font-bold text-black mt-4">Grid Columns</Text>
            {gridColumns.map((col, colIndex) => (
              <TextInput
                key={colIndex}
                value={col}
                onChangeText={(text) => handleColumnChange(text, colIndex)}
                placeholder={`Column ${colIndex + 1}`}
                className="border-b border-gray-400 text-black mt-1"
              />
            ))}
            <TouchableOpacity
              onPress={handleAddColumn}
              className="flex-row items-center mt-2"
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Column</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom actions */}
        <View className="mt-8 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => onCopyQuestion(index)} className="mr-4">
            <Ionicons name="copy-outline" size={24} color="black" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="font-bold text-black mr-2">Required</Text>
            <Switch value={isRequired} onValueChange={setIsRequired} />
          </View>

          <TouchableOpacity onPress={() => onDeleteQuestion(index)}>
            <Ionicons name="trash-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuestionBoxCom;

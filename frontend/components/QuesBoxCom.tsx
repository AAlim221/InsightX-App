import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface MPI {
  isMPIIndicator: boolean;
  dimension: string;
  conditionType: string;
  value: string | number;
}

interface Question {
  question: string;
  type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  minValue?: number;
  maxValue?: number;
  mpi?: MPI;
}

interface QuesBoxProps {
  index: number;
  question: string;
  type: string;
  options: string[];
  rows?: string[];
  columns?: string[];
  minValue?: number;
  maxValue?: number;
  mpi?: MPI;
  onMPIChange: (index: number, field: keyof MPI, value: any) => void;

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
  mpi = {
    isMPIIndicator: false,
    dimension: "",
    conditionType: "",
    value: "",
  },
  onQuestionChange,
  onTypeChange,
  onOptionsChange,
  onGridChange,
  onCopyQuestion,
  onDeleteQuestion,
  onMinValueChange,
  onMaxValueChange,
  onMPIChange,
}) => {
  const [mcqOptions, setMcqOptions] = useState(options);
  const [gridRows, setGridRows] = useState<string[]>(rows);
  const [gridColumns, setGridColumns] = useState<string[]>(columns);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

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

  const mpiConditionOptions = ["lessThan", "greaterThan", "equals", "notEquals", "includes"];

  const handleOptionSelect = (option: string) => {
    setDropdownVisible(false);
    setMcqOptions([""]);
    setGridRows(option.includes("grid") ? [""] : []);
    setGridColumns(option.includes("grid") ? [""] : []);
    onTypeChange(index, option);
  };

  const handleMcqChange = (text: string, optionIndex: number) => {
    const updated = [...mcqOptions];
    updated[optionIndex] = text;
    setMcqOptions(updated);
    onOptionsChange(index, updated);
  };

  const handleAddOption = () => {
    const updated = [...mcqOptions, ""];
    setMcqOptions(updated);
    onOptionsChange(index, updated);
  };

  const generateGridOptions = (rows: number, columns: number) => {
    return Array.from({ length: rows * columns }, (_, i) => `Option ${i + 1}`);
  };

  const handleGridUpdate = (updatedRows: string[], updatedColumns: string[]) => {
    setGridRows(updatedRows);
    setGridColumns(updatedColumns);
    onGridChange?.(index, updatedRows, updatedColumns);
    onOptionsChange(index, generateGridOptions(updatedRows.length, updatedColumns.length));
  };

  const handleRowChange = (text: string, rowIndex: number) => {
    const updated = [...gridRows];
    updated[rowIndex] = text;
    handleGridUpdate(updated, gridColumns);
  };

  const handleColumnChange = (text: string, colIndex: number) => {
    const updated = [...gridColumns];
    updated[colIndex] = text;
    handleGridUpdate(gridRows, updated);
  };

  const onDimensionChange = (index: number, value: string) => {
    onMPIChange(index, "dimension", value);
  };

  const onConditionTypeChange = (index: number, value: string) => {
    onMPIChange(index, "conditionType", value);
  };

  const onConditionValueChange = (index: number, value: string) => {
    onMPIChange(index, "value", value);
  };

  return (
    <SafeAreaView>
      <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <TextInput
          placeholder="Write Question here"
          className="text-black text-xl font-bold mb-4"
          value={question}
          onChangeText={(text) => onQuestionChange(index, text)}
        />
        
        {/* Question Type Dropdown */}
        <View className="bg-white p-4 rounded-lg space-y-3 shadow-md">
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            className="flex-row items-center justify-between"
          >
            <Text className="text-black font-bold">{type}</Text>
            <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={24} color="black" />
          </TouchableOpacity>

          {dropdownVisible && (
            <FlatList
              data={typeOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleOptionSelect(item)} className="p-2">
                  <Text className="text-black">{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Short Answer */}
        {type === "short-answer" && (
          <TextInput
            placeholder="Type your answer here"
            className="bg-white text-black mt-2 p-2 rounded-lg shadow-lg border border-gray-200"
          />
        )}

        {/* Paragraph */}
        {type === "paragraph" && (
          <TextInput
            placeholder="Type your paragraph answer here"
            className="bg-white text-black mt-2 p-2 rounded-lg shadow-lg border border-gray-200"
            multiline
            numberOfLines={4}
          />
        )}

        {/* Linear Scale & Rating */}
        {["linear-scale", "rating"].includes(type) && (
          <View className="bg-gray-200 p-4 rounded-md mt-2">
            <Text className="text-lg font-bold">Min & Max Values</Text>
            <TextInput
              placeholder="Min Value"
              keyboardType="numeric"
              className="bg-white p-2 rounded-md mt-2"
              value={minValue?.toString() || ""}
              onChangeText={(val) => onMinValueChange(index, Number(val))}
            />
            <TextInput
              placeholder="Max Value"
              keyboardType="numeric"
              className="bg-white p-2 rounded-md mt-2"
              value={maxValue?.toString() || ""}
              onChangeText={(val) => onMaxValueChange(index, Number(val))}
            />
          </View>
        )}

        {/* MCQ or Checkbox Options */}
        {(type === "multiple-choice" || type === "checkboxes") && (
          <View className="mt-4">
            {mcqOptions.map((opt, idx) => (
              <View key={idx} className="flex-row items-center mt-2">
                <Ionicons
                  name={type === "multiple-choice" ? "radio-button-off" : "checkbox-outline"}
                  size={24}
                  color="black"
                />
                <TextInput
                  value={opt}
                  onChangeText={(text) => handleMcqChange(text, idx)}
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

        {/* Grid Inputs */}
        {(type === "multiple-choice-grid" || type === "checkbox-grid") && (
          <View className="mt-4">
            <Text className="font-bold text-black">Grid Rows</Text>
            {gridRows.map((row, idx) => (
              <TextInput
                key={idx}
                value={row}
                onChangeText={(text) => handleRowChange(text, idx)}
                placeholder={`Row ${idx + 1}`}
                className="border-b border-gray-400 text-black mt-1"
              />
            ))}
            <TouchableOpacity
              onPress={() => handleGridUpdate([...gridRows, `Row ${gridRows.length + 1}`], gridColumns)}
              className="flex-row items-center mt-2"
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Row</Text>
            </TouchableOpacity>

            <Text className="font-bold text-black mt-4">Grid Columns</Text>
            {gridColumns.map((col, idx) => (
              <TextInput
                key={idx}
                value={col}
                onChangeText={(text) => handleColumnChange(text, idx)}
                placeholder={`Column ${idx + 1}`}
                className="border-b border-gray-400 text-black mt-1"
              />
            ))}
            <TouchableOpacity
              onPress={() => handleGridUpdate(gridRows, [...gridColumns, `Col ${gridColumns.length + 1}`])}
              className="flex-row items-center mt-2"
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text className="ml-2 text-black">Add Column</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MPI Indicator Section */}
        <View className="mt-6 border-t border-gray-200 pt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-black font-bold">MPI Indicator</Text>
            <Switch
              value={mpi.isMPIIndicator}
              onValueChange={(value) => onMPIChange(index, "isMPIIndicator", value)}
            />
          </View>

          {mpi.isMPIIndicator && (
            <View className="mt-2">
              <TextInput
                placeholder="Dimension (e.g. Health)"
                value={mpi.dimension}
                onChangeText={(text) => onDimensionChange(index, text)}
                className="bg-white text-black p-2 rounded-md shadow border border-gray-300 mt-2"
              />
              <Text className="mt-2 text-black font-semibold">Condition Type</Text>
              <FlatList
                horizontal
                data={mpiConditionOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => onConditionTypeChange(index, item)}
                    className={`px-3 py-1 rounded-full border m-1 ${
                      mpi.conditionType === item ? "bg-blue-200" : ""
                    }`}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TextInput
                placeholder="Value (e.g. 5)"
                value={mpi.value?.toString()}
                onChangeText={(text) => onConditionValueChange(index, text)}
                className="bg-white text-black p-2 rounded-md shadow border border-gray-300 mt-2"
              />
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="mt-8 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => onCopyQuestion(index)}>
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

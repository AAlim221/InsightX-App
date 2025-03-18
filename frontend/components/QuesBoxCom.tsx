import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownCom from "./DropDownCom"; // Ensure correct path

interface QuesBoxProps {
  index: number;
  question: string;
  type: string;
  options: string[];
  rows?: string[];
  columns?: string[];
  onQuestionChange: (index: number, value: string) => void;
  onTypeChange: (index: number, type: string) => void;
  onOptionsChange: (index: number, options: string[]) => void;
  onGridChange?: (index: number, rows: string[], columns: string[]) => void;
}

const QuesBoxCom: React.FC<QuesBoxProps> = ({
  index,
  question,
  type,
  options,
  rows = [""],
  columns = [""],
  onQuestionChange,
  onTypeChange,
  onOptionsChange,
  onGridChange,
}) => {
  const [isRequired, setIsRequired] = useState(false);
  const [mcqOptions, setMcqOptions] = useState(options);
  const [gridRows, setGridRows] = useState<string[]>(rows);
  const [gridColumns, setGridColumns] = useState<string[]>(columns);

  /** Handle MCQ options change */
  const handleMcqChange = (text: string, optionIndex: number) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions[optionIndex] = text;
    setMcqOptions(updatedOptions);
    onOptionsChange(index, updatedOptions);
  };

  /** Add a new MCQ option */
  const handleAddOption = () => {
    const updatedOptions = [...mcqOptions, ""];
    setMcqOptions(updatedOptions);
    onOptionsChange(index, updatedOptions);
  };

  /** Handle Grid Rows & Columns Change */
  const handleGridUpdate = (updatedRows: string[], updatedColumns: string[]) => {
    console.log("Updated Rows:", updatedRows);
    console.log("Updated Columns:", updatedColumns);

    const rowsToSend = updatedRows.length > 0 ? updatedRows : [""];
    const colsToSend = updatedColumns.length > 0 ? updatedColumns : [""];

    setGridRows(rowsToSend);
    setGridColumns(colsToSend);

    // Automatically update options based on the number of rows and columns
    const newOptions = generateGridOptions(rowsToSend.length, colsToSend.length);
    setMcqOptions(newOptions);

    if (onGridChange) onGridChange(index, rowsToSend, colsToSend);
    onOptionsChange(index, newOptions); // Ensure this is triggered to update the options
  };

  const generateGridOptions = (numRows: number, numColumns: number): string[] => {
    const newOptions = [];
    for (let i = 0; i < numRows * numColumns; i++) {
      newOptions.push(`Option ${i + 1}`);
    }
    return newOptions;
  };

  /** Handle Row Change */
  const handleRowChange = (text: string, rowIndex: number) => {
    const updatedRows = [...gridRows];
    updatedRows[rowIndex] = text;
    handleGridUpdate(updatedRows, gridColumns);
  };

  /** Handle Column Change */
  const handleColumnChange = (text: string, colIndex: number) => {
    const updatedColumns = [...gridColumns];
    updatedColumns[colIndex] = text;
    handleGridUpdate(gridRows, updatedColumns);
  };

  /** Add a new Row */
  const handleAddRow = () => handleGridUpdate([...gridRows, `Row ${gridRows.length + 1}`], gridColumns);

  /** Add a new Column */
  const handleAddColumn = () => handleGridUpdate(gridRows, [...gridColumns, `Col ${gridColumns.length + 1}`]);

  return (
    <SafeAreaView>
      <View className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <TextInput
          placeholder="Write Question here"
          className="text-black text-xl font-bold"
          value={question}
          onChangeText={(text) => onQuestionChange(index, text)}
        />
      </View>
      <DropDownCom index={index} type={type} onTypeChange={onTypeChange} />

      {/* MCQ / Checkbox Options */}
      {(type === "multiple-choice" || type === "checkboxes") && (
        <View className="mt-4">
          {mcqOptions.map((option, optionIndex) => (
            <View key={optionIndex} className="flex-row items-center mt-2">
              <TextInput
                value={option}
                onChangeText={(text) => handleMcqChange(text, optionIndex)}
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

      {/* Grid (Multiple Choice Grid & Checkbox Grid) */}
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
          <TouchableOpacity onPress={handleAddRow} className="flex-row items-center mt-2">
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
          <TouchableOpacity onPress={handleAddColumn} className="flex-row items-center mt-2">
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text className="ml-2 text-black">Add Column</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="mt-4 flex-row justify-between items-center">
        <MaterialIcons name="content-copy" size={24} color="black" />
        <View className="flex-row items-center space-x-2">
          <Text className="text-slate-900 font-bold">Required</Text>
          <Switch
            value={isRequired}
            onValueChange={setIsRequired}
            trackColor={{ true: "#00C6C6", false: "#ccc" }}
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

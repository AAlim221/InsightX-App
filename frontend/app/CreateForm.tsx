// Merged CreateForm.tsx + PeopleInfoCom.tsx with enhanced UI & visual copy of Survey Name + Details

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QuesBoxCom from "@/components/QuesBoxCom";
import HeaderOfTemplate from "@/components/HeaderOfTemplate";

// Define Question type
type Question = {
  question: string;
  type: string;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  rows?: string[];
  columns?: string[];
  answer?: string[][];
};

const CreateForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [surveyDetails, setSurveyDetails] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", type: "", options: [] },
  ]);
  const [peopleDetails, setPeopleDetails] = useState<{ [key: string]: string }>({});
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<Map<string, string>>(new Map());
  const [showTitleCopy, setShowTitleCopy] = useState(false);

  const handlePeopleInfoChange = (updatedInfo: { [key: string]: string }) => {
    setPeopleDetails((prev) => ({ ...prev, ...updatedInfo }));
  };

  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => {
        if (i === index) {
          const updatedQuestion = {
            ...q,
            [key]: Array.isArray(value) ? [...value] : value,
          };

          if (
            key === "type" &&
            (value === "multiple-choice-grid" || value === "checkbox-grid")
          ) {
            updatedQuestion.rows = q.rows?.length ? [...q.rows] : ["Row 1"];
            updatedQuestion.columns = q.columns?.length ? [...q.columns] : ["Column 1"];
          }

          if (key === "type" && ["linear-scale", "rating"].includes(value)) {
            updatedQuestion.minValue = updatedQuestion.minValue ?? 0;
            updatedQuestion.maxValue = updatedQuestion.maxValue ?? 10;
          }

          return updatedQuestion;
        }
        return q;
      })
    );
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", type: "", options: [], rows: [], columns: [] }]);
  };

  const copyQuestion = (index: number) => {
    setQuestions([...questions, { ...questions[index] }]);
  };

  const handleCopyTitleBar = () => {
    if (!surveyName.trim() && !surveyDetails.trim()) {
      Alert.alert("Nothing to copy", "Survey Name and Details are empty.");
      return;
    }
    setShowTitleCopy(true);
  };

  const handleCopyLastQuestion = () => {
    if (questions.length === 0) {
      Alert.alert("No question to copy");
      return;
    }
    setQuestions([...questions, { ...questions[questions.length - 1] }]);
    Alert.alert("Copied", "Last question duplicated.");
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const generateGridOptions = (numRows: number, numColumns: number): string[] => {
    const newOptions = [];
    for (let i = 0; i < numRows * numColumns; i++) {
      newOptions.push(`Option ${i + 1}`);
    }
    return newOptions;
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.some((q) => q.question.trim() === "" || !q.type)) {
      Alert.alert("Error", "Please add a title and valid questions.");
      return;
    }

    if (
      questions.some(
        (q) =>
          ["linear-scale", "rating"].includes(q.type) &&
          (q.minValue === undefined || q.maxValue === undefined)
      )
    ) {
      Alert.alert("Error", "Please provide both Min and Max values for rating/scale types.");
      return;
    }

    if (
      questions.some(
        (q) =>
          ["multiple-choice", "checkboxes"].includes(q.type) &&
          (!q.options || q.options.length === 0)
      )
    ) {
      Alert.alert("Error", "Options must be provided for multiple-choice and checkbox questions.");
      return;
    }

    if (
      questions.some(
        (q) =>
          ["multiple-choice-grid", "checkbox-grid"].includes(q.type) &&
          (!q.rows?.length || !q.columns?.length)
      )
    ) {
      Alert.alert("Error", "Both rows and columns are required for grid questions.");
      return;
    }

    const cleanedQuestions = questions.map((q) => ({
      ...q,
      options: ["multiple-choice", "checkboxes"].includes(q.type)
        ? q.options ?? []
        : ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? generateGridOptions(q.rows?.length ?? 0, q.columns?.length ?? 0)
        : [],
      rows: ["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? q.rows ?? [] : [],
      columns: ["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? q.columns ?? [] : [],
      minValue: ["linear-scale", "rating"].includes(q.type) ? q.minValue : undefined,
      maxValue: ["linear-scale", "rating"].includes(q.type) ? q.maxValue : undefined,
    }));

    const formData = {
      title,
      peopleDetails,
      surveyName,
      surveyDetails,
      questions: cleanedQuestions,
    };

    try {
      const response = await fetch("http://192.168.0.183:8082/api/v1/auth/createForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Form Published!", [
          { text: "OK", onPress: () => router.push("/ResearcherDashboard") },
        ]);
      } else {
        Alert.alert("Error", responseData.message || "Failed to save form");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
  };

  const peopleOptions = ["name", "mobile", "age", "nid", "division", "district"];

  const handleSelectField = (option: string) => {
    if (!selectedFields.has(option)) {
      const updatedFields = new Map(selectedFields);
      updatedFields.set(option, "");
      setSelectedFields(updatedFields);
      notifyChange(updatedFields);
    }
    setIsModalVisible(false);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedFields = new Map(selectedFields);
    updatedFields.set(field, value);
    setSelectedFields(updatedFields);
    notifyChange(updatedFields);
  };

  const handleRemoveField = (field: string) => {
    const updatedFields = new Map(selectedFields);
    updatedFields.delete(field);
    setSelectedFields(updatedFields);
    notifyChange(updatedFields);
  };

  const notifyChange = (fields: Map<string, string>) => {
    const allSelectedFields = Object.fromEntries(
      Array.from(fields.entries()).map(([key, value]) => [key.toLowerCase(), value])
    );
    handlePeopleInfoChange(allSelectedFields);
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      <HeaderOfTemplate handleSubmit={handleSubmit} />
      <ScrollView className="px-4">
        <View className="mt-2 mb-4 bg-white p-4 rounded-lg shadow-md">
          <TextInput
            placeholder="Survey title"
            className="bg-purple-600 text-2xl text-slate-50 text-center py-3 rounded-lg"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* People Info Modal Trigger */}
        <TouchableOpacity className="w-full mt-2 mb-4 bg-white p-4 rounded-lg shadow-md" onPress={() => setIsModalVisible(true)}>
          <Text className="text-black w-full text-xl font-bold text-center">People Information ▼</Text>
        </TouchableOpacity>

        <Modal transparent animationType="slide" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
          <View className="w-full flex-1 justify-center items-center bg-black/50">
            <View className="w-[90%] bg-white p-4 rounded-md">
              <Text className="text-xl font-bold text-center mb-4">Select Information</Text>
              {peopleOptions.map((option, index) => (
                <TouchableOpacity key={index} className="p-2 border-b border-gray-300" onPress={() => handleSelectField(option)}>
                  <Text className="text-lg">{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className="mt-4 bg-red-500 p-3 rounded-md" onPress={() => setIsModalVisible(false)}>
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View className="w-full bg-white p-4 mt-4 rounded-md">
          {selectedFields.size === 0 ? (
            <Text className="text-center text-gray-500">No fields selected</Text>
          ) : (
            Array.from(selectedFields.entries()).map(([field, value], index) => (
              <View key={index} className="mb-4">
                <Text className="text-lg font-bold mb-2">{field}</Text>
                <TextInput
                  value={value}
                  placeholder={`Enter ${field}`}
                  onChangeText={(text) => handleInputChange(field, text)}
                  keyboardType={field === "age" ? "numeric" : field === "mobile" ? "phone-pad" : "default"}
                  className="w-full p-3 bg-white border-2 border-gray-300 rounded-md"
                />
                <TouchableOpacity className="mt-2 bg-red-500 p-2 rounded-md" onPress={() => handleRemoveField(field)}>
                  <Text className="text-white text-center font-bold">Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View className="mt-4 bg-white p-4 rounded-lg shadow-md gap-4">
          <TextInput
            placeholder="Survey Name"
            className="bg-purple-400 text-slate-50 py-2 px-4 rounded-lg"
            value={surveyName}
            onChangeText={setSurveyName}
          />
          <TextInput
            placeholder="Survey Details"
            className="bg-purple-400 text-slate-50 py-2 px-4 rounded-lg"
            value={surveyDetails}
            onChangeText={setSurveyDetails}
          />
        </View>

        {showTitleCopy && (
          <View className="mt-4 bg-white p-4 rounded-lg">
            <View className="bg-purple-300 rounded-lg mb-2 p-3">
              <Text className="text-white text-lg">{surveyName}</Text>
            </View>
            <View className="bg-purple-300 rounded-lg p-3">
              <Text className="text-white text-lg">{surveyDetails}</Text>
            </View>
          </View>
        )}

        <FlatList
          data={questions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <QuesBoxCom
              index={index}
              question={item.question}
              type={item.type}
              options={item.options || []}
              rows={item.rows || []}
              columns={item.columns || []}
              minValue={item.minValue}
              maxValue={item.maxValue}
              onQuestionChange={(i, value) => updateQuestion(i, "question", value)}
              onTypeChange={(i, type) => updateQuestion(i, "type", type)}
              onOptionsChange={(i, options) => updateQuestion(i, "options", options)}
              onGridChange={(i, rows, columns) => {
                updateQuestion(i, "rows", rows);
                updateQuestion(i, "columns", columns);
              }}
              onMinValueChange={(i, value) => updateQuestion(i, "minValue", value)}
              onMaxValueChange={(i, value) => updateQuestion(i, "maxValue", value)}
              onCopyQuestion={copyQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          )}
        />

        <View className="mt-4 mb-6">
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>

      <View className="flex-row justify-between items-center bg-purple-500 p-4 shadow-lg">
        <TouchableOpacity onPress={handleCopyTitleBar}>
          <FontAwesome name="clone" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCopyLastQuestion}>
          <FontAwesome name="plus-circle" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}> 
          <FontAwesome name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Download feature coming soon!")}>
          <FontAwesome name="download" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/SettingsMenu")}> 
          <FontAwesome name="bars" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateForm;
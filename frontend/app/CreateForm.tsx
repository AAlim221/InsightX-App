import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Alert,
  Button,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QuesBoxCom from "@/components/QuesBoxCom";
import PeopleInfoCom from "@/components/PeopleInfoCom";
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
  const [peopleDetails, setPeopleDetails] = useState({
    name: "o",
    age: "0",
    nid: "o",
    mobile: "0",
    division: "o",
    district: "o",
    thana: "o",
  });

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
            updatedQuestion.columns = q.columns?.length
              ? [...q.columns]
              : ["Column 1"];
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
    setQuestions([
      ...questions,
      { question: "", type: "", options: [], rows: [], columns: [] },
    ]);
  };

  const copyQuestion = (index: number) => {
    setQuestions([...questions, { ...questions[index] }]);
  };
  // Copy the title bar value (you can modify this to do something meaningful like storing it in clipboard or duplicating form title)
  const handleCopyTitleBar = () => {
    if (!title.trim()) {
      Alert.alert("Nothing to copy", "Title is empty.");
      return;
    }
    Alert.alert("Copied", `Survey Title "${title}" is copied.`);
  };

  // Copy the last question
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

  const generateGridOptions = (
    numRows: number,
    numColumns: number
  ): string[] => {
    const newOptions = [];
    for (let i = 0; i < numRows * numColumns; i++) {
      newOptions.push(`Option ${i + 1}`);
    }
    return newOptions;
  };

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      questions.some((q) => q.question.trim() === "" || !q.type)
    ) {
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
      Alert.alert(
        "Error",
        "Please provide both Min and Max values for rating/scale types."
      );
      return;
    }

    if (
      questions.some(
        (q) =>
          ["multiple-choice", "checkboxes"].includes(q.type) &&
          (!q.options || q.options.length === 0)
      )
    ) {
      Alert.alert(
        "Error",
        "Options must be provided for multiple-choice and checkbox questions."
      );
      return;
    }

    if (
      questions.some(
        (q) =>
          ["multiple-choice-grid", "checkbox-grid"].includes(q.type) &&
          (!q.rows?.length || !q.columns?.length)
      )
    ) {
      Alert.alert(
        "Error",
        "Both rows and columns are required for grid questions."
      );
      return;
    }

    const cleanedQuestions = questions.map((q) => ({
      ...q,
      options: ["multiple-choice", "checkboxes"].includes(q.type)
        ? q.options ?? []
        : ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? generateGridOptions(q.rows?.length ?? 0, q.columns?.length ?? 0)
        : [],
      rows: ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? q.rows ?? []
        : [],
      columns: ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? q.columns ?? []
        : [],
      minValue: ["linear-scale", "rating"].includes(q.type)
        ? q.minValue
        : undefined,
      maxValue: ["linear-scale", "rating"].includes(q.type)
        ? q.maxValue
        : undefined,
    }));

    const selectedPeopleDetails: { [key: string]: string } = {};
    Object.entries(peopleDetails).forEach(([key, value]) => {
      if (value === "") selectedPeopleDetails[key] = value;
    });

    const formData = {
      title,
      peopleDetails: selectedPeopleDetails,
      surveyName,
      surveyDetails,
      questions: cleanedQuestions,
    };

    try {
      const response = await fetch(
        "http://192.168.0.183:8082/api/v1/auth/createForm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

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

        <PeopleInfoCom onPeopleInfoChange={handlePeopleInfoChange} />

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
              onQuestionChange={(i, value) =>
                updateQuestion(i, "question", value)
              }
              onTypeChange={(i, type) => updateQuestion(i, "type", type)}
              onOptionsChange={(i, options) =>
                updateQuestion(i, "options", options)
              }
              onGridChange={(i, rows, columns) => {
                updateQuestion(i, "rows", rows);
                updateQuestion(i, "columns", columns);
              }}
              onMinValueChange={(i, value) =>
                updateQuestion(i, "minValue", value)
              }
              onMaxValueChange={(i, value) =>
                updateQuestion(i, "maxValue", value)
              }
              onCopyQuestion={copyQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          )}
        />

        <View className="mt-4 mb-6">
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center bg-purple-500 p-4 shadow-lg">
        {/* Copy Title Bar */}
        <TouchableOpacity onPress={handleCopyTitleBar}>
          <FontAwesome name="clone" size={26} color="white" />
        </TouchableOpacity>

        {/* Copy Last Question */}
        <TouchableOpacity onPress={handleCopyLastQuestion}>
          <FontAwesome name="plus-circle" size={30} color="white" />
        </TouchableOpacity>

        {/* Navigate Home */}
        <TouchableOpacity onPress={() => router.push("/HomeScreen")}>
          <FontAwesome name="home" size={30} color="white" />
        </TouchableOpacity>

        {/* Placeholder for download */}
        <TouchableOpacity
          onPress={() => alert("Download feature coming soon!")}
        >
          <FontAwesome name="download" size={30} color="white" />
        </TouchableOpacity>

        {/* Navigate to Settings Menu */}
        <TouchableOpacity onPress={() => router.push("/SettingsMenu")}>
          <FontAwesome name="bars" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateForm;

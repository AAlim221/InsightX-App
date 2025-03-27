import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, Button, FlatList, TouchableOpacity} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import QuesBoxCom from "@/components/QuesBoxCom";
import PeopleInfoCom from "@/components/PeopleInfoCom";
import HeaderOfTemplate from "@/components/HeaderOfTemplate";
import BottomNavCom from "@/components/BottomNavCom";
import { RootStackParamList } from "./Navigation";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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

// Define Props type
type Props = NativeStackScreenProps<RootStackParamList, "CreateForm">;
// create form props
const CreateForm: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [peopleDetails, setPeopleDetails] = useState({
    name: "",
    age: "",
    nid: "",
    mobile: "",
    division: "",
    district: "",
    thana: "",
  });

  const [surveyName, setSurveyName] = useState("");
  const [surveyDetails, setSurveyDetails] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", type: "", options: [] },
  ]);
// people info handle
  const handlePeopleInfoChange = (updatedInfo: { [key: string]: string }) => {
    setPeopleDetails((prev) => ({ ...prev, ...updatedInfo }));
  };
//update question handle
  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => {
        if (i === index) {
          const updatedQuestion = { ...q, [key]: Array.isArray(value) ? [...value] : value };

          // Ensure that rows and columns persist when updating grid-related types
          if (key === "type" && (value === "multiple-choice-grid" || value === "checkbox-grid")) {
            updatedQuestion.rows = q.rows && q.rows.length > 0 ? [...q.rows] : ["Row 1"];
            updatedQuestion.columns = q.columns && q.columns.length > 0 ? [...q.columns] : ["Column 1"];
          }

          return updatedQuestion;
        }
        return q;
      })
    );
  };
// add question handle
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "", options: [], rows: [], columns: [] },
    ]);
  };
  // copy quetion handle
  const copyQuestion = (index: number) => {
    setQuestions([...questions, { ...questions[index] }]);
  };
// delete question handle
  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
// Grid handle
  const generateGridOptions = (numRows: number, numColumns: number): string[] => {
    const newOptions = [];
    for (let i = 0; i < numRows * numColumns; i++) {
      newOptions.push(`Option ${i + 1}`);
    }
    return newOptions;
  };
// publish handle
  const handleSubmit = async () => {
    console.log("Title:", title);
    console.log("Questions:", questions);

    // Validate inputs
    const invalidQuestion = questions.some(q =>
      !q.question.trim() ||
      !q.type ||
      (["multiple-choice", "checkboxes"].includes(q.type) && (!q.options || q.options.length === 0)) ||
      (["multiple-choice-grid", "checkbox-grid"].includes(q.type) && (!q.rows || !q.columns))
    );

    if (!title.trim() || invalidQuestion) {
      Alert.alert("Error", "Please ensure all required fields are filled.");
      return;
    }
// clean option handle
    const cleanedQuestions = questions.map((q) => ({
      ...q,
      options: ["multiple-choice", "checkboxes"].includes(q.type) ? q.options ?? [] : [],
      rows: ["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? q.rows ?? [] : [],
      columns: ["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? q.columns ?? [] : [],
      minValue: ["linear-scale", "rating"].includes(q.type) ? q.minValue : undefined,
      maxValue: ["linear-scale", "rating"].includes(q.type) ? q.maxValue : undefined,
    }));
//form data handle all info
    const formData = { title, peopleDetails: {}, surveyName, surveyDetails, questions: cleanedQuestions };
    console.log("Form Data Sent:", JSON.stringify(formData, null, 2)); // Debugging log
//Api connection
    try {
      const response = await fetch("http:///10.46.25.110:8082/api/v1/auth/createForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
// form publisn and navigate next destination
      const responseData = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Form Published!", [{ text: "OK", onPress: () => router.push("/Surveyor") }]);
      } else {
        Alert.alert("Error", `Failed to save form: ${responseData.message || "Unknown error"}`);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      <HeaderOfTemplate handleSubmit={handleSubmit} />
      <ScrollView className="px-4">
                    {/*Survey Tittle part */}
        <View className="mt-2 mb-4  bg-white p-4 rounded-lg shadow-md">
          <TextInput
            placeholder="Survey title"
            className="bg-purple-600 text-2xl text-slate-50 text-center py-3 rounded-lg"
            value={title}
            onChangeText={setTitle}
          />
        </View>
         {/* People info part*/}
        <PeopleInfoCom onPeopleInfoChange={handlePeopleInfoChange} />
         {/*Tittle Bar of survey */}
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
         {/*Dynamic flatlist */}

        <FlatList
          data={questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View key={index}>
              <QuesBoxCom
                index={index}
                question={item.question}
                type={item.type}
                options={item.options || []}
                rows={item.rows || []}
                columns={item.columns || []}
                onQuestionChange={(i: number, value: string) => updateQuestion(i, "question", value)}
                onTypeChange={(i: number, type: string) => updateQuestion(i, "type", type)}
                onOptionsChange={(i: number, options: string[]) => updateQuestion(i, "options", options)}
                onGridChange={(rows, columns) => updateQuestion(index, "rows", rows)}
                onCopyQuestion={copyQuestion}
                onDeleteQuestion={deleteQuestion}
              />
            </View>
          )}
        />
 {/*Add buttom  part */}
        <View className="mt-4">
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>
       {/* Bottom nav part */}
      <BottomNavCom />
    </SafeAreaView>
  );
};

export default CreateForm;

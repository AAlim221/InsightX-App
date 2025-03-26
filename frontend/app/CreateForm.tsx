import React, { useState } from "react";
<<<<<<< HEAD
import {View,Text,TextInput,ScrollView,Alert,Button,FlatList,} from "react-native";
import { Link, useRouter } from "expo-router";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
=======
import { View, Text, TextInput, ScrollView, Alert, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from '@react-native-picker/picker'; // Updated import
import QuesBoxCom from "@/components/QuesBoxCom";
import PeopleInfoCom from "@/components/PeopleInfoCom";
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
import HeaderOfTemplate from "@/components/HeaderOfTemplate";
import PeopleInfoCom from "@/components/PeopleInfoCom";
import QuesBoxCom from "@/components/QuesBoxCom";
import BottomNavCom from "@/components/BottomNavCom";
<<<<<<< HEAD
import { RootStackParamList } from "./Navigation";
=======
import { RootStackParamList } from "./Navigation";  // Import RootStackParamList from navigation.tsx
import { TouchableOpacity } from "react-native";



>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
type Question = {
  question: string;
  type: string;
  options?: string[];
  minValue?: number;
  maxValue?: number;
<<<<<<< HEAD
  rows?: string[];
  columns?: string[];
  answer?: string[][];
=======
  rows?: string[]; 
  columns?: string[];
  answer?: string[][]; 
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
};

type Props = NativeStackScreenProps<RootStackParamList, "CreateForm">;

<<<<<<< HEAD

const CreateForm: React.FC<Props> = ({ navigation }) => {
=======
const CreateForm: React.FC<Props> = ({navigation}) => {
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
  const [title, setTitle] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [surveyDetails, setSurveyDetails] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", type: "", options: [] },
  ]);

<<<<<<< HEAD
=======
 
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => {
        if (i === index) {
<<<<<<< HEAD
          const updatedQuestion = {
            ...q,
            [key]: Array.isArray(value) ? [...value] : value,
          };

          // Only update rows/columns if type is being changed to a grid type
          if (
            key === "type" &&
            (value === "multiple-choice-grid" || value === "checkbox-grid")
          ) {
            updatedQuestion.rows = q.rows?.length ? q.rows : [""];
            updatedQuestion.columns = q.columns?.length ? q.columns : [""];
          }

=======
          const updatedQuestion = { ...q, [key]: Array.isArray(value) ? [...value] : value };
  
          // Only update rows/columns if type is being changed to a grid type
          if (key === "type" && (value === "multiple-choice-grid" || value === "checkbox-grid")) {
            updatedQuestion.rows = q.rows?.length ? q.rows : [""];
            updatedQuestion.columns = q.columns?.length ? q.columns : [""];
            
          }
  
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
          return updatedQuestion;
        }
        return q;
      })
    );
  };
<<<<<<< HEAD
  //Add question handle
=======
  
  
  

>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "", options: [], rows: [], columns: [] },
    ]);
  };
<<<<<<< HEAD
  // copy question handle
  const copyQuestion = (index: number) => {
    setQuestions([...questions, { ...questions[index] }]);
  };
  //delete question handle
  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  // publish button handle
=======
  

>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
  const handleSubmit = async () => {
    console.log("Title:", title);
    console.log("Questions:", questions);

    // Validate if title or any question is empty or has invalid type
<<<<<<< HEAD
    if (
      !title.trim() ||
      questions.some((q) => q.question.trim() === "" || !q.type)
    ) {
=======
    if (!title.trim() || questions.some((q) => q.question.trim() === "" || !q.type)) {
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
      Alert.alert("Error", "Please add a title and valid questions.");
      return;
    }

    // Ensure options are provided only for multiple-choice or checkbox questions
<<<<<<< HEAD
    if (
      questions.some(
        (q) =>
          (q.type === "multiple-choice" || q.type === "checkboxes") &&
          (!q.options || q.options.length === 0)
      )
    ) {
      Alert.alert(
        "Error",
        "Options must be provided for multiple-choice and checkbox questions."
      );
      return;
    }
    //For check-box-grid and multiple-choice-grid
    if (
      questions.some(
        (q) =>
          (q.type === "multiple-choice-grid" || q.type === "checkbox-grid") &&
          (!q.rows ||
            q.rows.length === 0 ||
            !q.columns ||
            q.columns.length === 0)
      )
    ) {
      Alert.alert(
        "Error",
        "Rows and Columns must be provided for grid-type questions."
      );
      return;
    }
    if (
      questions.some((q) => {
        if (
          (q.type === "multiple-choice" || q.type === "checkboxes") &&
          (!q.options || q.options.length === 0)
        ) {
          Alert.alert(
            "Error",
            "Options must be provided for multiple-choice and checkbox questions."
          );
          return true;
        }
        if (
          (q.type === "multiple-choice-grid" || q.type === "checkbox-grid") &&
          (!q.rows ||
            q.rows.length === 0 ||
            !q.columns ||
            q.columns.length === 0)
        ) {
          Alert.alert(
            "Error",
            "Both rows and columns must be provided for grid-based questions."
          );
          return true;
        }
        return false;
      })
    ) {
      return;
    }

    const cleanedQuestions = questions.map((q) => ({
      ...q,

      // For multiple-choice or checkboxes, keep options; otherwise, set it as empty array
      options: ["multiple-choice", "checkboxes"].includes(q.type)
        ? q.options ?? []
        : // For grid types, generate options based on rows and columns
        ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? generateGridOptions(q.rows?.length ?? 0, q.columns?.length ?? 0)
        : [],

      // For grid types (multiple-choice-grid or checkbox-grid), keep rows and columns; otherwise, set them as empty arrays
      rows: ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? q.rows ?? []
        : [],
      columns: ["multiple-choice-grid", "checkbox-grid"].includes(q.type)
        ? q.columns ?? []
        : [],

      // For linear-scale or rating types, keep min and max values
      minValue: ["linear-scale", "rating"].includes(q.type)
        ? q.minValue
        : undefined,
      maxValue: ["linear-scale", "rating"].includes(q.type)
        ? q.maxValue
        : undefined,
    }));

    // Function to generate options for the grid based on rows and columns
    function generateGridOptions(
      numRows: number,
      numColumns: number
    ): string[] {
      const newOptions = [];
      for (let i = 0; i < numRows * numColumns; i++) {
        newOptions.push(`Option ${i + 1}`);
      }
      return newOptions;
    }
=======
    if (questions.some((q) =>
      (q.type === "multiple-choice" || q.type === "checkboxes") && (!q.options || q.options.length === 0)
    )) {
      Alert.alert("Error", "Options must be provided for multiple-choice and checkbox questions.");
      return;
    }
    //For check-box-grid and multiple-choice-grid
    if (questions.some((q) =>
      (q.type === "multiple-choice-grid" || q.type === "checkbox-grid") &&
      (!q.rows || q.rows.length === 0 || !q.columns || q.columns.length === 0)
    )) {
      Alert.alert("Error", "Rows and Columns must be provided for grid-type questions.");
      return;
    }
    if (questions.some((q) => {
    if ((q.type === "multiple-choice" || q.type === "checkboxes") && (!q.options || q.options.length === 0)) {
        Alert.alert("Error", "Options must be provided for multiple-choice and checkbox questions.");
        return true;
    }
    if ((q.type === "multiple-choice-grid" || q.type === "checkbox-grid") && 
        (!q.rows || q.rows.length === 0 || !q.columns || q.columns.length === 0)) {
        Alert.alert("Error", "Both rows and columns must be provided for grid-based questions.");
        return true;
    }
    return false;
})) {
    return;
}

  
const cleanedQuestions = questions.map((q) => ({
  ...q,
  
  // For multiple-choice or checkboxes, keep options; otherwise, set it as empty array
  options: ["multiple-choice", "checkboxes"].includes(q.type) ? q.options ?? [] :
    // For grid types, generate options based on rows and columns
    (["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? generateGridOptions(q.rows?.length ?? 0, q.columns?.length ?? 0) : []),
  
  // For grid types (multiple-choice-grid or checkbox-grid), keep rows and columns; otherwise, set them as empty arrays
  rows: ["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? q.rows ?? [] : [],
  columns: ["multiple-choice-grid", "checkbox-grid"].includes(q.type) ? q.columns ?? [] : [],
  
  // For linear-scale or rating types, keep min and max values
  minValue: ["linear-scale", "rating"].includes(q.type) ? q.minValue : undefined,
  maxValue: ["linear-scale", "rating"].includes(q.type) ? q.maxValue : undefined,
}));

// Function to generate options for the grid based on rows and columns
function generateGridOptions(numRows: number, numColumns: number): string[] {
  const newOptions = [];
  for (let i = 0; i < numRows * numColumns; i++) {
    newOptions.push(`Option ${i + 1}`);
  }
  return newOptions;
}
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da

    // Validate min and max values for "linear-scale" and "rating"
    if (
      cleanedQuestions.some(
        (q) =>
          ["linear-scale", "rating"].includes(q.type) &&
          (q.minValue === undefined || q.maxValue === undefined)
      )
    ) {
<<<<<<< HEAD
      Alert.alert(
        "Error",
        "Please provide Min and Max values for Linear Scale & Rating questions."
      );
      return;
    }

    const formData = {
      title,
      surveyName,
      surveyDetails,
      questions: cleanedQuestions,
    };
=======
      Alert.alert("Error", "Please provide Min and Max values for Linear Scale & Rating questions.");
      return;
    }

    const formData = { title, surveyName, surveyDetails, questions: cleanedQuestions };
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da

    console.log("Submitting Form Data:", JSON.stringify(formData, null, 2));

    try {
<<<<<<< HEAD
      const response = await fetch(
        "http://10.46.25.110:8082/api/v1/auth/createForm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();
      console.log("Response Data:", responseData);
// apply condition for navigation
      if (response.ok) {
        Alert.alert("Success", "Form Published!", [
          { text: "OK", onPress: () => router.push("/Surveyor") }
        ]);
      }
       else {
        Alert.alert(
          "Error",
          `Failed to save form: ${responseData.message || "Unknown error"}`
        );
=======
      const response = await fetch("http://192.168.0.197:8082/api/v1/auth/createForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (response.ok) {
        Alert.alert("Success", "Form Published!");
        navigation.navigate("HomeScreen");  
      } else {
        Alert.alert("Error", `Failed to save form: ${responseData.message || "Unknown error"}`);
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "An error occurred.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      <HeaderOfTemplate handleSubmit={handleSubmit} />
      <ScrollView className="px-4">
<<<<<<< HEAD
        <View className="mt-4 mb-4 bg-slate-50 p-4 rounded-lg shadow-md">
=======
        <View className="mt-2 bg-white p-4 rounded-lg shadow-md">
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
          <TextInput
            placeholder="Survey title"
            className="bg-purple-600 text-white text-center py-3 rounded-lg"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <PeopleInfoCom />
        <View className="mt-4 bg-white p-4 rounded-lg shadow-md gap-4">
          <TextInput
            placeholder="Survey Name"
            className="bg-purple-400 text-black py-2 px-4 rounded-lg"
            value={surveyName}
            onChangeText={setSurveyName}
          />
          <TextInput
            placeholder="Survey Details"
            className="bg-purple-400 text-black py-2 px-4 rounded-lg"
            value={surveyDetails}
            onChangeText={setSurveyDetails}
          />
        </View>

        {/* Using FlatList to render questions dynamically */}
        <FlatList
          data={questions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
<<<<<<< HEAD
=======
            
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
            <View key={index}>
              <QuesBoxCom
                index={index}
                question={item.question}
                type={item.type}
                options={item.options || []}
<<<<<<< HEAD
                onQuestionChange={(i: number, value: string) =>
                  updateQuestion(i, "question", value)
                }
                onTypeChange={(i: number, type: string) =>
                  updateQuestion(i, "type", type)
                }
                onOptionsChange={(i: number, options: string[]) =>
                  updateQuestion(i, "options", options)
                }
                onCopyQuestion={copyQuestion}
                onDeleteQuestion={deleteQuestion}
              />

              {/* Render input field for Short Answer questions */}
              {item.type === "short-answer" && (
                <View className="mt-4">
                  <TextInput
                    placeholder="Type your answer here"
                    className="bg-white text-black p-3 rounded-lg"
                    value="" // Bind to the answer field  // Use the question text as input
                    onChangeText={(text) =>
                      updateQuestion(index, "question", text)
                    } // Update question text
                  />
                </View>
              )}
              {/* Render input field for Paragraph questions */}
              {item.type === "paragraph" && (
                <View className="mt-4">
                  <TextInput
                    placeholder="Type your paragraph answer here"
                    className="bg-white text-black p-3 rounded-lg"
                    multiline={true} // Allow multi-line input
                    numberOfLines={4} // Adjust number of visible lines
                    value="" // Bind to the answer field
                    onChangeText={(text) =>
                      updateQuestion(index, "answer", text)
                    } // Update the answer field
                  />
                </View>
              )}

              {/* Render additional fields for "Linear Scale" and "Rating" */}
              {["linear-scale", "rating"].includes(item.type) && (
                <View className="bg-gray-200 p-4 rounded-md mt-2">
                  <Text className="text-lg font-bold">Min & Max Values</Text>
                  <TextInput
                    placeholder="Min Value"
                    keyboardType="numeric"
                    className="bg-white p-2 rounded-md mt-2"
                    value={item.minValue?.toString() || ""}
                    onChangeText={(text) => {
                      const value = Number(text);
                      if (!isNaN(value))
                        updateQuestion(index, "minValue", value);
                    }}
                  />
=======
                onQuestionChange={(i: number, value: string) => updateQuestion(i, "question", value)}
                onTypeChange={(i: number, type: string) => updateQuestion(i, "type", type)}
                onOptionsChange={(i: number, options: string[]) => updateQuestion(i, "options", options)}
              />

              
 {/* Render input field for Short Answer questions */}
 {item.type === "short-answer" && (
            <View className="mt-4">
              <TextInput
                placeholder="Type your answer here"
                className="bg-white text-black p-3 rounded-lg"
                value="" // Bind to the answer field  // Use the question text as input
                onChangeText={(text) => updateQuestion(index, "question", text)}  // Update question text
              />
            </View>
          )}
          {/* Render input field for Paragraph questions */}
      {item.type === "paragraph" && (
        <View className="mt-4">
          <TextInput
            placeholder="Type your paragraph answer here"
            className="bg-white text-black p-3 rounded-lg"
            multiline={true}  // Allow multi-line input
            numberOfLines={4}  // Adjust number of visible lines
            value="" // Bind to the answer field
            onChangeText={(text) => updateQuestion(index, "answer", text)}  // Update the answer field
          />
        </View>
      )}
     
          {/* Render additional fields for "Linear Scale" and "Rating" */}
          {["linear-scale", "rating"].includes(item.type) && (
            <View className="bg-gray-200 p-4 rounded-md mt-2">
              <Text className="text-lg font-bold">Min & Max Values</Text>
              <TextInput
                placeholder="Min Value"
                keyboardType="numeric"
                className="bg-white p-2 rounded-md mt-2"
                value={item.minValue?.toString() || ""}
                onChangeText={(text) => {
                  const value = Number(text);
                  if (!isNaN(value)) updateQuestion(index, "minValue", value);
                }}
              />
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
                  <TextInput
                    placeholder="Max Value"
                    keyboardType="numeric"
                    className="bg-white p-2 rounded-md mt-2"
                    value={item.maxValue?.toString() || ""}
                    onChangeText={(text) => {
                      const value = Number(text);
<<<<<<< HEAD
                      if (!isNaN(value))
                        updateQuestion(index, "maxValue", value);
=======
                      if (!isNaN(value)) updateQuestion(index, "maxValue", value);
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
                    }}
                  />
                </View>
              )}
            </View>
          )}
        />
<<<<<<< HEAD
        <View className="mt-4 rounded-3xl">
=======

        <View className="mt-4">
>>>>>>> 0b24abe58d1f29a5ab0db2a524875b7e330873da
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>
      <BottomNavCom />
    </SafeAreaView>
  );
};

export default CreateForm;




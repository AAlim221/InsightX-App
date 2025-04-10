import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Alert,
  Button,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { router } from "expo-router";
import QuesBoxCom from "@/components/QuesBoxCom";
import PeopleInfoCom from "@/components/PeopleInfoCom";
import HeaderOfTemplate from "@/components/HeaderOfTemplate";
import BottomNavCom from "@/components/BottomNavCom";
import { RootStackParamList } from "./Navigation";

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

const CreateForm: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("");


  const [peopleDetails, setPeopleDetails] = useState({
    name: "o",
    age: "0",
    nid: "o",
    mobile: "0",
    division: "o",
    district: "o",
    thana: "o",
  });
  const [surveyName, setSurveyName] = useState("");
  const [surveyDetails, setSurveyDetails] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", type: "", options: [] },
  ]);
  // people information

  const handlePeopleInfoChange = (updatedInfo: { [key: string]: string }) => {
    setPeopleDetails((prev) => ({
      ...prev,
      ...updatedInfo,  // Merge the selected fields into peopleDetails
    }));
  }
   


  //update grid
  const updateGrid = (index: number, rows: string[], columns: string[]) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === index ? { ...q, rows: [...rows], columns: [...columns] } : q
      )
    );
  };
  // Update question handle
  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => {
        if (i === index) {
          const updatedQuestion = {
            ...q,
            [key]: Array.isArray(value) ? [...value] : value,
          };

          // Ensure that rows and columns persist when updating grid-related types
          if (
            key === "type" &&
            (value === "multiple-choice-grid" || value === "checkbox-grid")
          ) {
            updatedQuestion.rows =
              q.rows && q.rows.length > 0 ? [...q.rows] : ["Row 1"];
            updatedQuestion.columns =
              q.columns && q.columns.length > 0 ? [...q.columns] : ["Column 1"];
          }
            
          // Ensure min and max values persist for rating or linear-scale type questions
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
  // add question handle
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "", options: [], rows: [], columns: [] },
    ]);
  };
  // Copy Question
  const copyQuestion = (index: number) => {
    setQuestions([...questions, { ...questions[index] }]);
  };
  // Delete Question
  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  //Option Genarate
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
  // Handle Submit
  const handleSubmit = async () => {
    console.log("Title:", title);
    console.log("People Details:", peopleDetails); // Only the selected fields will be here

   
    // Validate if title or any question is empty or has invalid type
    if (!title.trim() || questions.some((q) => q.question.trim() === "" || !q.type)) {
      Alert.alert("Error", "Please add a title and valid questions.");
      return;
    }

 // Validate min and max values for "linear-scale" and "rating"
 if (
  questions.some(
    (q) =>
      (q.type === "linear-scale" || q.type === "rating") &&
      (q.minValue === undefined || q.maxValue === undefined)
  )
) {
  Alert.alert(
    "Error",
    "Please provide both Min and Max values for Linear Scale & Rating questions."
  );
  return;
}
    // Ensure options are provided only for multiple-choice or checkbox questions
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
    // Only include selected (empty string) peopleDetails keys
const selectedPeopleDetails: { [key: string]: string } = {};
Object.entries(peopleDetails).forEach(([key, value]) => {
  if (value === "") {
    selectedPeopleDetails[key] = value;
  }
});

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
    
        // Validate min and max values for "linear-scale" and "rating"
        if (
          cleanedQuestions.some(
            (q) =>
              ["linear-scale", "rating"].includes(q.type) &&
              (q.minValue === undefined || q.maxValue === undefined)
          )
        ) {
          Alert.alert("Error", "Please provide Min and Max values for Linear Scale & Rating questions.");
          return;
        }

    const formData = {
      title,
      peopleDetails: selectedPeopleDetails,
      surveyName,
      surveyDetails,
      questions: cleanedQuestions,
    };
    console.log("Form Data Sent:", JSON.stringify(formData, null, 2)); // Debugging log
    try {
      const response = await fetch(
        "http://192.168.0.183:8082/api/v1/auth/createForm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      //form submit and navigate
      const responseData = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Form Published!", [
          { text: "OK", onPress: () => router.push("/Researcher") },
        ]);
      } else {
        Alert.alert(
          "Error",
          `Failed to save form: ${responseData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-purple-500">
      <HeaderOfTemplate handleSubmit={handleSubmit} />
      <ScrollView className="px-4">
        <View className="mt-2 mb-4  bg-white p-4 rounded-lg shadow-md">
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
                minValue={item.minValue} // Passing min and max values to the component
                maxValue={item.maxValue}
                onQuestionChange={(i: number, value: string) =>
                  updateQuestion(i, "question", value)
                }
                onTypeChange={(i: number, type: string) =>
                  updateQuestion(i, "type", type)
                }
                onOptionsChange={(i: number, options: string[]) =>
                  updateQuestion(i, "options", options)
                }
                onGridChange={(i, rows, columns) => {
                  updateQuestion(i, "rows", rows);
                  updateQuestion(i, "columns", columns);
                }}
                onMinValueChange={(i: number, value: number) =>
                  updateQuestion(i, "minValue", value)
                }
                onMaxValueChange={(i: number, value: number) =>
                  updateQuestion(i, "maxValue", value)
                }
                onCopyQuestion={copyQuestion}
                onDeleteQuestion={deleteQuestion}
              />
            </View>
          )}
        />

        <View className="mt-4">
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>
      <BottomNavCom />
    </SafeAreaView>
  );
};

export default CreateForm;

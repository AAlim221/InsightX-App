import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Alert,
  Button,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuesBoxCom from "@/components/QuesBoxCom";
import HeaderOfTemplate from "@/components/HeaderOfTemplate";

type MPI = {
  isMPIIndicator: boolean;
  dimension: string;
  conditionType: string;
  value: string | number;
};

type Question = {
  question: string;
  type: string;
  options?: string[];
  rows?: string[];
  columns?: string[];
  minValue?: number;
  maxValue?: number;
  mpi?: MPI;
};

const CreateForm = () => {
  const router = useRouter();
  const { user: userParam } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (userParam) {
        try {
          const parsed = JSON.parse(userParam as string);
          setUser(parsed);
          await AsyncStorage.setItem("loggedInUser", JSON.stringify(parsed));
          
        } catch (err) {
          console.error("Error parsing user from param");
        }
      } else {
        const storedUser = await AsyncStorage.getItem("loggedInUser");
        if (storedUser) setUser(JSON.parse(storedUser));
        else Alert.alert("Error", "User not found. Please log in again.");
      }
    };
    loadUser();
  }, [userParam]);
  
  

  const [title, setTitle] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [surveyDetails, setSurveyDetails] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      type: "short-answer", // default to avoid backend rejection
      options: [],
      rows: [],
      columns: [],
      mpi: { isMPIIndicator: false, dimension: "", conditionType: "", value: "" },
    },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Map<string, string>>(new Map());

  const peopleOptions = ["name", "mobile", "age", "nid", "division", "district"];
  const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 0;

  const handleSelectField = (option: string) => {
    if (!selectedFields.has(option)) {
      const updatedFields = new Map(selectedFields);
      updatedFields.set(option, "");
      setSelectedFields(updatedFields);
    }
    setIsModalVisible(false);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedFields = new Map(selectedFields);
    updatedFields.set(field, value);
    setSelectedFields(updatedFields);
  };

  const handleRemoveField = (field: string) => {
    const updatedFields = new Map(selectedFields);
    updatedFields.delete(field);
    setSelectedFields(updatedFields);
  };

  const handleMPIChange = (index: number, field: keyof MPI, value: string | number | boolean) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              mpi: q.mpi
                ? { ...q.mpi, [field]: value }
                : {
                    isMPIIndicator: false,
                    dimension: "",
                    conditionType: "",
                    value: "",
                  },
            }
          : q
      )
    );
  };

  const updateQuestion = (index: number, key: keyof Question, value: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => {
        if (i === index) {
          const updated = { ...q, [key]: Array.isArray(value) ? [...value] : value };
          if (["multiple-choice-grid", "checkbox-grid"].includes(updated.type)) {
            updated.rows = updated.rows?.length ? [...updated.rows] : ["Row 1"];
            updated.columns = updated.columns?.length ? [...updated.columns] : ["Column 1"];
          }
          if (["linear-scale", "rating"].includes(updated.type)) {
            updated.minValue = updated.minValue ?? 0;
            updated.maxValue = updated.maxValue ?? 10;
          }
          if (!updated.mpi) {
            updated.mpi = { isMPIIndicator: false, dimension: "", conditionType: "", value: "" };
          }
          return updated;
        }
        return q;
      })
    );
  };

  const addQuestion = () =>
    setQuestions([
      ...questions,
      {
        question: "",
        type: "",
        options: [],
        rows: [],
        columns: [],
        mpi: { isMPIIndicator: false, dimension: "", conditionType: "", value: "" },
      },
    ]);

  const copyQuestion = (index: number) => setQuestions([...questions, { ...questions[index] }]);
  const deleteQuestion = (index: number) => setQuestions(questions.filter((_, i) => i !== index));

  const handleCopyTitleBar = () => {
    if (!title.trim()) return Alert.alert("Nothing to copy", "Title is empty.");
    Alert.alert("Copied", `Survey Title \"${title}\" is copied.`);
  };

  const handleCopyLastQuestion = () => {
    if (questions.length === 0) return Alert.alert("No question to copy");
    setQuestions([...questions, { ...questions[questions.length - 1] }]);
    Alert.alert("Copied", "Last question duplicated.");
  };

  const generateGridOptions = (numRows: number, numColumns: number): string[] => {
    const newOptions = [];
    for (let i = 0; i < numRows * numColumns; i++) newOptions.push(`Option ${i + 1}`);
    return newOptions;
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.some((q) => q.question.trim() === "" || !q.type)) {
      return Alert.alert("Error", "Please add a title and valid questions.");
    }
  
    for (let q of questions) {
      if (["linear-scale", "rating"].includes(q.type) && (q.minValue === undefined || q.maxValue === undefined))
        return Alert.alert("Error", "Provide both Min and Max values for rating/scale types.");
  
      if (["multiple-choice", "checkboxes"].includes(q.type) && (!q.options || q.options.length === 0))
        return Alert.alert("Error", "Options required for multiple-choice and checkbox questions.");
  
      if (["multiple-choice-grid", "checkbox-grid"].includes(q.type) && (!q.rows?.length || !q.columns?.length))
        return Alert.alert("Error", "Both rows and columns required for grid questions.");
  
      if (q.mpi?.isMPIIndicator && (!q.mpi.dimension.trim() || !q.mpi.conditionType.trim() || q.mpi.value == null))
        return Alert.alert("Error", "Specify a valid deprivation condition for MPI indicators.");
    }
  
    // ✅ NEW: Check researcherId
    if (!user || !user._id) {
      return Alert.alert("Error", "Logged-in user not found. Please log in again.");
    }
  
    // 🧾 Final form data
    const formData = {
      title,
      peopleDetails: Object.fromEntries(selectedFields),
      surveyName,
      surveyDetails,
      questions,
      researcherId: user._id,
    };
  
    console.log("Submitting formData", formData); // Optional log
  
    try {
      const res = await fetch("http://192.168.0.183:8082/api/v1/auth/createForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Form Published!", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.setItem("loggedInUser", JSON.stringify(user)); // ✅ Save user
              router.push({
                pathname: "/ResearcherDashboard",
                params: { user: JSON.stringify(user) }, // ✅ Pass user param
              });
            },
          },
        ]);
      }
      

 
      else {
        Alert.alert("Error", data.message || "Failed to save form");
      }
    } catch (err) {
      Alert.alert("Error", "An error occurred.");
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-purple-600">
      <View style={{ paddingTop: statusBarHeight }} className="bg-purple-600">
        <HeaderOfTemplate handleSubmit={handleSubmit} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-4">
        <View className="mt-3 mb-4 bg-white p-4 rounded-xl">
          <TextInput
            placeholder="Survey title"
            value={title}
            onChangeText={setTitle}
            className="bg-purple-700 text-white text-2xl text-center py-3 px-4 rounded-xl"
          />
        </View>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} className="w-full bg-white p-4 rounded-xl mb-4">
          <Text className="text-center text-xl font-bold">People Information ▼</Text>
        </TouchableOpacity>
        <Modal transparent animationType="slide" visible={isModalVisible}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-[90%] bg-white p-6 rounded-xl">
              <Text className="text-xl font-bold text-center mb-4">Select Information</Text>
              {peopleOptions.map((option, i) => (
                <TouchableOpacity key={i} className="p-2 border-b border-gray-300" onPress={() => handleSelectField(option)}>
                  <Text className="text-lg">{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="mt-4 bg-red-500 py-3 rounded-md">
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View className="bg-white p-4 rounded-xl mb-4">
          {selectedFields.size === 0 ? (
            <Text className="text-center text-gray-500">No fields selected</Text>
          ) : (
            Array.from(selectedFields.entries()).map(([field, value], i) => (
              <View key={i} className="mb-4">
                <Text className="font-bold mb-2">{field}</Text>
                <TextInput
                  value={value}
                  placeholder={`Enter ${field}`}
                  onChangeText={(text) => handleInputChange(field, text)}
                  className="bg-gray-100 p-3 border border-gray-300 rounded-md"
                  keyboardType={field === "age" ? "numeric" : field === "mobile" ? "phone-pad" : "default"}
                />
                <TouchableOpacity onPress={() => handleRemoveField(field)} className="mt-2 bg-red-500 p-2 rounded-md">
                  <Text className="text-white text-center font-bold">Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        <View className="bg-white p-4 rounded-xl mb- space-y-4">
          <TextInput
            placeholder="Survey Name"
            value={surveyName}
            onChangeText={setSurveyName}
            className="bg-purple-400 text-white p-3 rounded-lg"
          />
          <TextInput
            placeholder="Survey Details"
            value={surveyDetails}
            onChangeText={setSurveyDetails}
            className="bg-purple-400 text-white p-3 rounded-lg"
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
              mpi={item.mpi}
              onMPIChange={handleMPIChange}
              onQuestionChange={(i, value) => updateQuestion(i, "question", value)}
              onTypeChange={(i, value) => updateQuestion(i, "type", value)}
              onOptionsChange={(i, opts) => updateQuestion(i, "options", opts)}
              onGridChange={(i, rows, cols) => {
                updateQuestion(i, "rows", rows);
                updateQuestion(i, "columns", cols);
              }}
              onMinValueChange={(i, val) => updateQuestion(i, "minValue", val)}
              onMaxValueChange={(i, val) => updateQuestion(i, "maxValue", val)}
              onCopyQuestion={copyQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          )}
        />
        <View className="my-6">
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-full bg-purple-600 px-6 py-4 flex-row justify-between items-center">
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
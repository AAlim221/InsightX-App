// Final merged & enhanced CreateForm screen with inline PeopleInfo UI
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
  Modal,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  minValue?: number;
  maxValue?: number;
  rows?: string[];
  columns?: string[];
  answer?: string[][];
  mpi?: MPI;
};

const CreateForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [surveyDetails, setSurveyDetails] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      type: "",
      options: [],
      mpi: { isMPIIndicator: false, dimension: "", conditionType: "", value: "" },
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Map<string, string>>(new Map());

  const peopleOptions = ["name", "mobile", "age", "nid", "division", "district"];

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

  const handleMPIChange = (index: number, field: keyof MPI, value: any) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              mpi: q.mpi ? { ...q.mpi, [field]: value } : {
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
          if (["multiple-choice-grid", "checkbox-grid"].includes(value)) {
            updated.rows = q.rows?.length ? [...q.rows] : ["Row 1"];
            updated.columns = q.columns?.length ? [...q.columns] : ["Column 1"];
          }
          if (["linear-scale", "rating"].includes(value)) {
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

  const addQuestion = () => setQuestions([...questions, { question: "", type: "", options: [], rows: [], columns: [] }]);
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
    if (!title.trim() || questions.some((q) => q.question.trim() === "" || !q.type))
      return Alert.alert("Error", "Please add a title and valid questions.");

    for (let q of questions) {
      if (["linear-scale", "rating"].includes(q.type) && (q.minValue === undefined || q.maxValue === undefined))
        return Alert.alert("Error", "Please provide both Min and Max values for rating/scale types.");
      if (["multiple-choice", "checkboxes"].includes(q.type) && (!q.options || q.options.length === 0))
        return Alert.alert("Error", "Options must be provided for multiple-choice and checkbox questions.");
      if (["multiple-choice-grid", "checkbox-grid"].includes(q.type) && (!q.rows?.length || !q.columns?.length))
        return Alert.alert("Error", "Both rows and columns are required for grid questions.");
      if (q.mpi?.isMPIIndicator && (!q.mpi.dimension.trim() || !q.mpi.conditionType.trim() || q.mpi.value == null))
        return Alert.alert("Error", "Please specify a valid deprivation condition for all MPI indicators.");
    }

    const cleanedQuestions = questions.map((q) => ({
      ...q,
      mpi: q.mpi?.isMPIIndicator ? q.mpi : undefined,
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

    const selectedPeopleDetails = Object.fromEntries(selectedFields);

    const formData = {
      title,
      peopleDetails: selectedPeopleDetails,
      surveyName,
      surveyDetails,
      questions: cleanedQuestions,
    };

    try {
      const res = await fetch("http://172.20.93.54:8082/api/v1/auth/createForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Success", "Form Published!", [{ text: "OK", onPress: () => router.push("/ResearcherDashboard") }]);
      } else {
        Alert.alert("Error", data.message || "Failed to save form");
      }
    } catch {
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

        {/* People Info Modal Trigger */}
        <TouchableOpacity
          className="w-full mt-2 mb-4 bg-white p-4 rounded-lg shadow-md"
          onPress={() => setIsModalVisible(true)}
        >
          <Text className="text-black text-xl font-bold text-center">People Information ▼</Text>
        </TouchableOpacity>

        {/* People Info Modal */}
        <Modal transparent animationType="slide" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
          <View className="w-full flex-1 justify-center items-center bg-black/50">
            <View className="w-[90%] bg-white p-4 rounded-md">
              <Text className="text-xl font-bold text-center mb-4">Select Information</Text>
              {peopleOptions.map((option, i) => (
                <TouchableOpacity key={i} className="p-2 border-b border-gray-300" onPress={() => handleSelectField(option)}>
                  <Text className="text-lg">{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className="mt-4 bg-red-500 p-3 rounded-md" onPress={() => setIsModalVisible(false)}>
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Display Selected People Info Fields */}
        <View className="w-full bg-white p-4 mt-4 rounded-md">
          {selectedFields.size === 0 ? (
            <Text className="text-center text-gray-500">No fields selected</Text>
          ) : (
            Array.from(selectedFields.entries()).map(([field, value], i) => (
              <View key={i} className="mb-4">
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

        {/* Survey Details */}
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

        {/* Questions List */}
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

        <View className="mt-4 mb-6">
          <Button title="Add Question" onPress={addQuestion} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
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

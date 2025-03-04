import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


type QuestionAnswers = {
  [key: string]: string | null;
};

const Template3 = () => {
  const [isRequired, setIsRequired] = useState(false);

  
  const [selectedOptions, setSelectedOptions] = useState<QuestionAnswers>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });

  const handleSelect = (question: string, option: string) => {
    setSelectedOptions((prevAnswers: QuestionAnswers) => ({
      ...prevAnswers,
      [question]: option,
    }));
  };

  const questions = [
    { id: "q1", text: "1. Do you visit a doctor for regular check-ups?", options: ["Yes, regularly", "Occasionally", "Rarely", "Never"] },
    { id: "q2", text: "2. How often do you exercise in a week?", options: ["Everyday", "2-3 times a week",
         "Once a week", "Never"] },
    { id: "q3", text: "3. Do you follow a healthy diet?", options: ["Yes, always", "Mostly", "Sometimes, but not consistently", 
        "No, I don't follow a healthy diet"] },
    { id: "q4", text: "4. How would you describe your sleep patterns?", options:["I sleep well and regularly", 
    "I sleep well but irregularly","I have trouble falling asleep", "I have frequent sleep disturbances", ]},
    { id: "q5", text: "5.  Do you experience stress regularly?", options: ["Yes, frequently", "Yes, occasionally", 
        "No, only in certain situations", " No, rarely"] },
    { id: "q6", text: "6.Have you had a medical emergency in the past year?", options: ["Yes, more than once", 
        "Yes, once", "No, but I had a minor issue", "No, I've been healthy"] },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header Section */}
      <View style={{ backgroundColor: "#30DCB7" }}className="px-4 pt-6 flex-row justify-between items-center">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
        <View className="flex-row space-x-3">
          <FontAwesome name="undo" size={24} color="black" />
        </View>
        </TouchableOpacity>

        <TouchableOpacity>
        <View className="flex-row space-x-3">
          <FontAwesome name="repeat" size={24} color="black" />
        </View>
        </TouchableOpacity>

        <TouchableOpacity>
        <View className="flex-row space-x-3">
          <FontAwesome name="paint-brush" size={24} color="black" />
        </View>
        </TouchableOpacity>

        <TouchableOpacity className="bg-yellow-300 px-4 py-2 rounded-lg">
          <Text className="text-black font-bold">Publish</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Survey Title */}
        <SafeAreaView style={{ backgroundColor: "#30DCB7" }} className="w-full min-h-[120px] mt-4 mb-4 rounded-lg 
          flex items-center justify-center">
            <View style={{ backgroundColor: "white" }} className="w-[90%] p-4 rounded-lg shadow ">
                <Text className="text-black text-center font-bold">Health Insights: Share Your Experience</Text>
             </View>
          </SafeAreaView>

        {/* Survey Details */}
        <SafeAreaView style={{ backgroundColor: "#30DCB7" }} className="w-full min-h-[160px] mt-4 rounded-lg flex items-center justify-center">
          <View className="w-[90%] mt-2 space-y-2">
           <Text style={{ backgroundColor: "white" }} className="text-black text-center font-bold py-4 px-4 rounded-lg">
                  Health Survey
           </Text>
           </View>
           <View className="w-[90%] mt-4 space-y-2 mb-6">
           <Text style={{ backgroundColor: "white" }} className="text-black text-center font-bold py-4 px-4 rounded-lg">
           This survey helps to understand individual's health behaviors, access to healthcare, and overall well-being
            </Text>
           </View>
          </SafeAreaView>

        {/* Render Questions Dynamically */}
        
         <SafeAreaView style={{ backgroundColor: "#30DCB7" }} className="min-h-[160px] mt-6 rounded-lg flex justify-center items-center px-4 pb-6">
          {questions.map((question) => (
            <View key={question.id} className="w-full max-w-lg">
              {/* Question Text */}
              <View className="mt-6 bg-white p-4 rounded-lg items-center">
                <Text className="text-black text-xl font-bold text-center">{question.text}</Text>
              </View>
        
              {/* Options */}
              <View className="bg-white p-4 mt-4 rounded-lg space-y-3 items-center w-full">
                {question.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect(question.id, option)}
                    className={`w-4/5 p-3 rounded-lg mt-2 ${index === question.options.length - 1 ? "mb-6" : "mb-2"} text-center ${
                      selectedOptions[question.id] === option ? "bg-[#30DCB7]" : "bg-gray-200"
                    }`}
                  >
                    <Text className={`text-black text-center ${selectedOptions[question.id] === option ? "font-bold" : ""}`}>
                      {selectedOptions[question.id] === option ? "✓ " : ""}{option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </SafeAreaView>

        {/* Required Toggle */}
        <SafeAreaView className="bg-white mt-4 mb-4 rounded-lg">
                 <View className="mt-1 flex-row justify-between items-center">
                   <MaterialIcons name="content-copy" size={24} color="black" />
                   <View className="flex-row items-center space-x-2">
                     <Text className="text-pink-400 font-bold">Required</Text>
                     <Switch value={isRequired} onValueChange={setIsRequired} trackColor={{ true: "#FF69B4", false: "#ccc" }} />
                   </View>
                   <TouchableOpacity>
                     <Ionicons name="trash" size={24} color="green" />
                   </TouchableOpacity>
                 </View>
               </SafeAreaView>
             </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ backgroundColor: "#30DCB7" }} className="flex-row justify-between items-center p-4">
        <TouchableOpacity>
          <Text className="text-black text-lg font-bold">TT</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="plus-circle" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="download" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="bars" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Template3;
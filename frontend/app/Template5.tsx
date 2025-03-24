import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRouter } from "expo-router";
import DropDownCom from "@/components/DropDownOption";

// Define your stack params
type RootStackParamList = {
  Template5: undefined;
  Home: undefined;
};

// Define the props for navigation
type Props = NativeStackScreenProps<RootStackParamList, 'Template5'>;

const Template5: React.FC<Props> = ({ navigation }) => {
  const [isRequired, setIsRequired] = useState(false);
  const [isRequired2, setIsRequired2] = useState(false);
  const [isRequired3, setIsRequired3] = useState(false);
  const [isRequired4, setIsRequired4] = useState(false);
  const [isRequired5, setIsRequired5] = useState(false);
  const [isRequired6, setIsRequired6] = useState(false);
  const [isRequired7, setIsRequired7] = useState(false);
  const [isRequired8, setIsRequired8] = useState(false);
  const [isRequired9, setIsRequired9] = useState(false);
  const [isRequired10, setIsRequired10] = useState(false);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedOption2, setSelectedOption2] = useState<number | null>(null);
  const [selectedOption3, setSelectedOption3] = useState<number | null>(null);
  const [selectedOption4, setSelectedOption4] = useState<number | null>(null);
  const [selectedOption5, setSelectedOption5] = useState<number | null>(null);
  const [selectedOption6, setSelectedOption6] = useState<number | null>(null);
  const [selectedOption7, setSelectedOption7] = useState<number | null>(null);
  const [selectedOption8, setSelectedOption8] = useState<number | null>(null);
  const [selectedOption9, setSelectedOption9] = useState<number | null>(null);
  const [selectedOption10, setSelectedOption10] = useState<number | null>(null);
  
   const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#EDF7C7]">
      {/* Header Section */}
      <View className="px-4 pt-6 flex-row justify-between items-center bg-[#6F9257] p-2">
      
        {/* Back Button */}
       <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Undo/Redo and Theme Icons */}
        <View className="flex-row space-x-3">
          <TouchableOpacity>
          <FontAwesome name="undo" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* Redo*/}
        
          <TouchableOpacity>
          <FontAwesome name="repeat" size={24} color="black" />
          </TouchableOpacity>
        
        
        {/* Paintbrush */}
        <View className="flex-row space-x-3">
          <TouchableOpacity>
          <FontAwesome name="paint-brush" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Publish Button */}
        <TouchableOpacity className="bg-[#EDF7C7] px-4 py-2 rounded-lg">
          <Text className="text-black font-bold">Publish</Text>
        </TouchableOpacity>
        {/* User Profile Icon */}
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Survey Title Input */}
        <View className="w-[full] mt-6 p-4  bg-[#8DAB6F] rounded-lg">
          <Text
            className="bg-[#CDDEA7] text-black font-bold text-center py-2 rounded-lg border-4 border-[#c3fac3]">
              Evaluating Customer Satisfaction in Online Food Delivery</Text>
        </View>

        {/*People information */}
       <View className="mt-6">
            <Text className="text-black text-center font-bold bg-[#c5d4a2] py-2 rounded-lg">
                  Enter Your Information</Text>
          </View>
                  
        {/*Information box*/}
        <View className="flex-1 mt-6 p-4  bg- rounded-lg bg-[#c5d4a2] h-auto">
           <TextInput placeholder='Enter Your Name'
            className="bg-[white] text-center py-2 rounded-lg"/>

           <TextInput placeholder='Enter Age'
            className="bg-[white] text-center py-2 mt-4 rounded-lg"/>

           <TextInput placeholder='Enter NID/Passport Number'
            className="bg-[white] text-center py-2 mt-4 rounded-lg"/>

           <TextInput placeholder='Enter Mobile Number'
            className="bg-[white] text-center py-2 mt-4 rounded-lg"/>

           <TextInput placeholder='Enter Division'
            className="bg-[white] text-center py-2 mt-4 rounded-lg"/>

            <TextInput placeholder='Enter District'
            className="bg-[white] text-center py-2 mt-4 rounded-lg"/>

            <TextInput placeholder='Enter Thana'
            className="bg-[white] text-center py-2 mt-4 rounded-lg"/>
        </View>


        {/* Survey Name and Details Input */}
        <View className="mt-6 p-4  bg-[#8DAB6F] rounded-lg h-auto">
          <Text
            className="bg-[#CDDEA7] font-bold text-black text-center py-2 rounded-lg border-4 border-[#c3fac3]">
              Online Food Delivery Experience Survey</Text>

              <Text
            className="bg-[#CDDEA7] font-bold text-black text-center py-2 mt-4 rounded-lg border-4 border-[#c3fac3]">
             The survey aims to gather insights into user preferences, 
             satisfaction levels, and common issues related to online food delivery services.</Text>

        </View>

        {/* Question Section */}

        {/* Q1 */}
        <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
              1. How often do you order food online?</Text>
            
          {/* Options */}
        
          <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
          <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired}
              onValueChange={setIsRequired}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

        {/*q2*/}
        <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
              2. Which food delivery app do you use most frequently?</Text>
          
          {/* Options */}
          <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired2}
              onValueChange={setIsRequired2}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity>
        
        </View>
        </View>

        {/*q3*/}
        <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
              3. What is your primary reason for choosing a food delivery service?</Text>

             {/*Option*/}
             <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired3}
              onValueChange={setIsRequired3}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity>
        
        </View>
        </View>

       {/*q4*/}
       <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
             4. How satisfied are you with the quality of food delivered?</Text>

             {/*Option*/}
             <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired4}
              onValueChange={setIsRequired4}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

       {/*q5*/}
       <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
             5.  What is your preferred method of payment for online food orders?
             </Text>

             {/*Option*/}
             <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired5}
              onValueChange={setIsRequired5}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

        {/*q6*/}
        <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            6. How often do you use promotional codes or discounts when ordering food online?</Text>

             {/*Option*/}
              <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired6}
              onValueChange={setIsRequired6}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

       {/*q7*/}
       <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            7.  Have you ever experienced issues with your online food delivery?
            </Text>

             {/*Option*/}
             <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired7}
              onValueChange={setIsRequired7}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

        {/*q8*/}
       <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            8.  If you encountered issues, what was the most common problem?
            </Text>

             {/*Option*/}
             <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-[#3E1415D9] font-bold">Required</Text>
            <Switch
              value={isRequired8}
              onValueChange={setIsRequired8}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

        {/*q9*/}
       <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            9. How important is customer support in your choice of a food delivery service?
            </Text>

             {/*Option*/}
             <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired9}
              onValueChange={setIsRequired9}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

        {/*q10*/}
        <View className="mt-6 bg-[#8DAB6F] p-4 rounded-lg h-auto mb-6">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
             10.  How likely are you to recommend your preferred food delivery app to others?
             </Text>

             {/*Option*/}
           <DropDownCom/>

        {/*required */}
        <View className="mt-4 flex-row justify-between items-center bg-[white] p-2">
        <TouchableOpacity>
                    <MaterialIcons name="content-copy" size={24} color="black"/>
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2">
            <Text className="text-pink-400 font-bold">Required</Text>
            <Switch
              value={isRequired10}
              onValueChange={setIsRequired10}
              trackColor={{ true: '#FF69B4', false: '#ccc' }}
            />
          </View>
          <TouchableOpacity>
            <Ionicons name="trash" size={24} color="green" />
          </TouchableOpacity> 
        </View>
        </View>

        
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center bg-[#6F9257] p-4">
        <TouchableOpacity>
          <Text className="text-black text-lg font-bold">TT</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="plus-circle" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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

export default Template5;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRouter } from "expo-router";
import DropDownCom from "@/components/DropDownOption";

// Define your stack params
type RootStackParamList = {
  Template4: undefined;
  Home: undefined;
};

// Define the props for navigation
type Props = NativeStackScreenProps<RootStackParamList, 'Template4'>;

const Template4: React.FC<Props> = ({ navigation }) => {
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
    <SafeAreaView className="flex-1 bg-[#c0a6f3ed]">
      {/* Header Section */}
      <View className="px-4 pt-6 flex-row justify-between items-center bg-[#483480] p-2">
      
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
        <TouchableOpacity className="bg-[#C7C4FF] px-4 py-2 rounded-lg">
          <Text className="text-black font-bold">Publish</Text>
        </TouchableOpacity>
        {/* User Profile Icon */}
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4">
        {/* Survey Title Input */}
        <View className="w-[full] mt-6 p-4  bg-[#4E339A] rounded-lg">
          <Text
            className="bg-[#2B0584] text-white font-bold text-center py-2 rounded-lg border-4 border-[#9B83BE]">
              Your Journey Matters</Text>
        </View>

        {/*People information */}
       <View className="mt-6">
            <Text className="text-black text-center font-bold bg-[#C7C4FF] py-2 rounded-lg">
                  Enter Your Information</Text>
          </View>
                  
        {/*Information box*/}
        <View className="flex-1 mt-6 p-4  bg- rounded-lg bg-[#C7C4FF] h-auto">
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
        <View className="mt-6 p-4  bg-[#4E339A] rounded-lg h-auto">
          <Text
            className="bg-[#2B0584] font-bold text-white text-center py-2 rounded-lg border-4 border-[#9B83BE]">
              Public Transportation Experience Survey</Text>

              <Text
            className="bg-[#2B0584] font-bold text-white text-center py-2 mt-4 rounded-lg border-4 border-[#9B83BE]">
             This survey helps understand people's experiences with public transportation.</Text>

        </View>

        {/* Question Section */}

        {/* Q1 */}
        <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
              1. How often do you use public transportation?</Text>
              
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
        <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
              2. What type of public transportation do you use most often?</Text>
              
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
        <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
              3. How would you rate the cleanliness of public transportation?</Text>

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
       <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
             4. Do you feel safe while using public transportation?</Text>

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
       <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
             5.  How easy is it to find information about public transportation schedules?
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
        <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            6.  How affordable do you think public transportation is?</Text>

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
       <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            7. How comfortable is the seating on public transportation?
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
       <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            8. Do you think there are enough public transportation options available?
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
       <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
            9. Would you recommend public transportation to others?
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
        <View className="mt-6 bg-[#4E339A] p-4 rounded-lg h-auto mb-6">
        <Text
            className="bg-white text-black font-bold py-2 rounded-lg p-2">
             10. How would you rate the customer service on public transportation?
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
      <View className="flex-row justify-between items-center bg-[#775B91] p-4">
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

export default Template4;

import React, { useState } from "react";
import { SafeAreaView,View, Text, TouchableOpacity,TextInput,Alert, Image, ImageComponent,} from "react-native";
import { Link, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import HeroImage from "@/components/HeroImage";
import LoginForm from "@/components/LoginForm";
export default function Login() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black justify-between pt-12 pb-4">
      <LoginForm/>
    </SafeAreaView>
  );
}

import React, { useState } from "react";
import { SafeAreaView,} from "react-native";
import { Link, useRouter } from "expo-router";
import HeroImage from "@/components/HeroImage";
import LoginForm from "@/components/LoginForm";
export default function Login() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black justify-between pt-12 pb-4">
      <HeroImage/>
      <LoginForm/>
    </SafeAreaView>
  );
}

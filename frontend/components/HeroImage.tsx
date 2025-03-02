// components/HeroImage.tsx
import React from "react";
import { View, Image } from "react-native";

export default function HeroImage() {
  return (
    <View className="relative">
      <Image
        source={require("../assets/images/Heroimg.png")}
        className="w-full h-60 rounded-3xl mb-4"
        resizeMode="cover"
      />
    </View>
  );
}

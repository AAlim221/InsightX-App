// components/HeroImage.tsx
import React from "react";
import { View, Image } from "react-native";

export default function HeroImage() {
  return (
    <View className="relative ml-6">
      <Image
        source={require("../assets/images/Heroimg.png")}
        className="w-full h-60 rounded-3xl"
        resizeMode="cover"
      />
    </View>
  );
}

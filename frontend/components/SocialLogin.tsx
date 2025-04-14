// components/SocialLogin.tsx
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AppleAuthentication from "expo-apple-authentication";

WebBrowser.maybeCompleteAuthSession();

export default function SocialLogin() {
  const router = useRouter();

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      ios: "YOUR_IOS_CLIENT_ID",
      android: "YOUR_ANDROID_CLIENT_ID",
      web: "YOUR_WEB_CLIENT_ID",
      default: "YOUR_EXPO_CLIENT_ID",
    }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("✅ Google Access Token:", authentication?.accessToken);
      router.push("/HomeScreen");
    }
  }, [response]);

  // Facebook Auth
  const [requestFB, responseFB, promptAsyncFB] = Facebook.useAuthRequest({
    clientId: "YOUR_FACEBOOK_APP_ID",
  });

  useEffect(() => {
    if (responseFB?.type === "success") {
      const { authentication } = responseFB;
      console.log("✅ Facebook Token:", authentication?.accessToken);
      router.push("/HomeScreen");
    }
  }, [responseFB]);

  // Apple Login
  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log("✅ Apple User Info:", credential);
      router.push("/HomeScreen");
    } catch (e: any) {
      if (e.code !== "ERR_CANCELED") {
        console.error("❌ Apple Login Error:", e);
      }
    }
  };

  return (
    <>
      <Text className="text-center text-white mb-2">Sign in with</Text>
      <View className="flex-row justify-center mb-4 space-x-6">
        {/* Google */}
        <TouchableOpacity
          className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
          onPress={() => promptAsync()}
        >
          <FontAwesome name="google" size={28} color="#DB4437" />
        </TouchableOpacity>

        {/* Apple (iOS only) */}
        {Platform.OS === "ios" && (
          <TouchableOpacity
            className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
            onPress={handleAppleLogin}
          >
            <FontAwesome name="apple" size={28} color="black" />
          </TouchableOpacity>
        )}

        {/* Facebook */}
        <TouchableOpacity
          className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-md"
          onPress={() => promptAsyncFB()}
        >
          <FontAwesome name="facebook" size={28} color="#1877F2" />
        </TouchableOpacity>
      </View>
    </>
  );
}

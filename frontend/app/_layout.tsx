import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Ensure colorScheme is defined

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
        <Stack.Screen name="CreateForm" options={{ headerShown: false }} />
        <Stack.Screen name="Template1" options={{ headerShown: false }} />
        <Stack.Screen name="Template2" options={{ headerShown: false }} />
        <Stack.Screen name="Template3" options={{ headerShown: false }} />
        <Stack.Screen name="Template4" options={{ headerShown: false }} />
        <Stack.Screen name="Template5" options={{ headerShown: false }} />
        <Stack.Screen name="ResearcherDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="SurveyorDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="SurveyorRegister" options={{ headerShown: false }} />
        <Stack.Screen name="SettingsMenu"options={{ headerShown: false }} />
        <Stack.Screen name="ProfileMenu"options={{ headerShown: false }} />
        <Stack.Screen name="SurveyorLogin" options={{ headerShown: false }} />
        <Stack.Screen name="InviteSelfServeyor" options={{ headerShown: false }} />
        <Stack.Screen name="Profile" options={{ headerShown: false }} />
        <Stack.Screen name="SurveyorList" options={{ headerShown: false }} />
        <Stack.Screen name="ResponseQuestion" options={{ headerShown: false }} />
        <Stack.Screen name="ResponseAnalysis" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}



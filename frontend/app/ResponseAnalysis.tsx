import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import MapView, { Marker } from "react-native-maps";

const ResponseAnalysis = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await axios.get("http://192.168.0.183:8082/api/v1/auth/listAllForms");
      setForms(res.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load forms");
    }
  };

  const fetchResponses = async (formId: string, status: string) => {
    setLoading(true);
    try {
      let url = `http://192.168.0.183:8082/api/v1/auth/form/${formId}`;
      if (status !== "all") url += `?status=${status}`;
      const res = await axios.get(url);
      setResponses(res.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load responses");
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = { pending: 0, reviewed: 0, flagged: 0 };
    responses.forEach((r) => {
      const status = r.reviewStatus;
      if (["pending", "reviewed", "flagged"].includes(status)) {
        counts[status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const exportCSV = async () => {
    try {
      if (responses.length === 0) return Alert.alert("No data to export");
      const csvContent = [
        "Respondent Name,Survey Name,Survey Details,Division,District,Status,Submitted At,Question,Answer",
        ...responses.flatMap((res) =>
          res.answers.map((a: any) =>
            `${res.respondentDetails?.name || "Unknown"},${res.surveyName || ""},${res.surveyDetails || ""},${res.respondentDetails?.division || ""},${res.respondentDetails?.district || ""},${res.reviewStatus},${new Date(res.createdAt).toLocaleString()},"${a.question.replace(/"/g, '""')}","${JSON.stringify(a.response).replace(/"/g, '""')}"`
          )
        )
      ].join("\n");
      const fileUri = FileSystem.documentDirectory + "responses.csv";
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert("Error", "Failed to export CSV");
    }
  };

  const exportPDF = async () => {
    try {
      if (responses.length === 0) return Alert.alert("No data to export");
      const htmlRows = responses.map((res, idx) => {
        const answerRows = res.answers.map((a: any) => `<p><strong>${a.question.replace(/</g, '&lt;').replace(/>/g, '&gt;')}:</strong> ${JSON.stringify(a.response)}</p>`).join('');
        return `
          <div style="border:1px solid #ccc; border-radius:5px; margin-bottom:20px; padding:15px;">
            <h3>#${idx + 1} - ${res.respondentDetails?.name || "Unknown"}</h3>
            <p><strong>Division:</strong> ${res.respondentDetails?.division || "N/A"}</p>
            <p><strong>District:</strong> ${res.respondentDetails?.district || "N/A"}</p>
            <p><strong>Survey:</strong> ${res.surveyName || "Untitled"}</p>
            <p><strong>Status:</strong> ${res.reviewStatus || "pending"}</p>
            <p><strong>Submitted:</strong> ${new Date(res.createdAt).toLocaleString()}</p>
            ${answerRows}
          </div>`;
      }).join('');

      const htmlContent = `<html><body style="font-family: Arial; padding: 20px;">
        <h1>Survey Responses</h1>${htmlRows}</body></html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to export PDF");
    }
  };

  const calculateMpiStats = () => {
    const total = responses.length || 1;
    let housing = 0, education = 0, water = 0, electricity = 0;
    responses.forEach((res) => {
      res.answers.forEach((a: any) => {
        if (a.question.includes("housing") && a.response === "poor") housing++;
        if (a.question.includes("education") && a.response === "none") education++;
        if (a.question.includes("water") && a.response === "no") water++;
        if (a.question.includes("electricity") && a.response === "no") electricity++;
      });
    });
    const overall = (housing + education + water + electricity) / (4 * total);
    return {
      housing: (housing / total * 100).toFixed(0),
      education: (education / total * 100).toFixed(0),
      water: (water / total * 100).toFixed(0),
      electricity: (electricity / total * 100).toFixed(0),
      overall,
    };
  };

  const calculateVulnerability = () => {
    let high = 0, moderate = 0, low = 0;
    responses.forEach((res) => {
      const riskScore = res.answers.reduce((score: number, a: any) => {
        if (a.question.includes("income") && a.response === "below 1000") score += 2;
        if (a.question.includes("health") && a.response === "poor") score += 2;
        if (a.question.includes("age") && parseInt(a.response) > 65) score += 1;
        return score;
      }, 0);
      if (riskScore >= 4) high++;
      else if (riskScore >= 2) moderate++;
      else low++;
    });
    return {
      high,
      moderate,
      low,
      total: high + moderate,
      totalResponses: responses.length,
    };
  };

  const statusCounts = getStatusCounts();
  const mpiStats = calculateMpiStats();
  const vulnerabilityStats = calculateVulnerability();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
        {!selectedFormId ? (
          <>
            <Text className="text-xl font-bold mb-4 text-center">Select a Form</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#6D28D9" />
            ) : forms.length === 0 ? (
              <Text className="text-center text-gray-500 mt-4">No forms available</Text>
            ) : (
              forms.map((form, index) => (
                <TouchableOpacity
                  key={form._id || index}
                  onPress={() => {
                    setSelectedFormId(form._id);
                    fetchResponses(form._id, statusFilter);
                  }}
                  className="bg-purple-100 p-4 rounded-xl mb-4"
                >
                  <Text className="text-lg font-semibold text-purple-900">{form.title}</Text>
                </TouchableOpacity>
              ))
            )}
          </>
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-3">
              <TouchableOpacity onPress={() => setSelectedFormId(null)}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-xl font-bold">Responses</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity onPress={exportCSV}>
                  <Ionicons name="download-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={exportPDF}>
                  <Ionicons name="document-text-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <PieChart
              data={[
                { name: "Pending", population: statusCounts.pending, color: "#facc15", legendFontColor: "#333", legendFontSize: 14 },
                { name: "Reviewed", population: statusCounts.reviewed, color: "#10b981", legendFontColor: "#333", legendFontSize: 14 },
                { name: "Flagged", population: statusCounts.flagged, color: "#ef4444", legendFontColor: "#333", legendFontSize: 14 },
              ]}
              width={Dimensions.get("window").width - 32}
              height={180}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: () => `#4b5563`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />

            {/* Chart: MPI Analysis */}
            <Text className="text-lg font-bold text-indigo-900 mt-6 mb-2">📊 MPI Indicators</Text>
            <PieChart
              data={[
                { name: "Housing", population: parseFloat(mpiStats.housing), color: "#6366f1", legendFontColor: "#444", legendFontSize: 13 },
                { name: "Education", population: parseFloat(mpiStats.education), color: "#60a5fa", legendFontColor: "#444", legendFontSize: 13 },
                { name: "Water", population: parseFloat(mpiStats.water), color: "#34d399", legendFontColor: "#444", legendFontSize: 13 },
                { name: "Electricity", population: parseFloat(mpiStats.electricity), color: "#facc15", legendFontColor: "#444", legendFontSize: 13 },
              ]}
              width={Dimensions.get("window").width - 32}
              height={180}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: () => `#4b5563`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />

            {/* Chart: Vulnerability */}
            <Text className="text-lg font-bold text-red-700 mt-6 mb-2">📉 Vulnerability Levels</Text>
            <PieChart
              data={[
                { name: "High", population: vulnerabilityStats.high, color: "#ef4444", legendFontColor: "#444", legendFontSize: 13 },
                { name: "Moderate", population: vulnerabilityStats.moderate, color: "#f97316", legendFontColor: "#444", legendFontSize: 13 },
                { name: "Low", population: vulnerabilityStats.low, color: "#10b981", legendFontColor: "#444", legendFontSize: 13 },
              ]}
              width={Dimensions.get("window").width - 32}
              height={180}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: () => `#4b5563`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />

            {/* Responses */}
            {loading ? (
              <ActivityIndicator size="large" color="#6D28D9" />
            ) : responses.length === 0 ? (
              <Text className="text-center text-gray-500 mt-4">No responses found</Text>
            ) : (
              responses.map((res, idx) => (
                <View key={idx} className="border rounded-xl p-4 mb-4 bg-gray-50">
                  <Text className="font-semibold mb-1 text-purple-800">
                    #{idx + 1} - {res.respondentDetails?.name || "Unknown"}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    Division: {res.respondentDetails?.division || "N/A"} | District: {res.respondentDetails?.district || "N/A"}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">Survey: {res.surveyName || "Untitled"}</Text>
                  <Text className="text-sm text-gray-800 mb-1">
                    Status: {res.reviewStatus || "pending"} | Submitted: {new Date(res.createdAt).toLocaleString()}
                  </Text>
                  <Text className="mt-2 font-bold text-gray-700">Answers:</Text>
                  {res.answers.map((a: any, i: number) => (
                    <Text key={i} className="text-sm text-gray-600">
                      • {a.question}: {JSON.stringify(a.response)}
                    </Text>
                  ))}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResponseAnalysis;

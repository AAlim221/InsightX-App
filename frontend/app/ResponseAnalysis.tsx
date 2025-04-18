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

  const getStatusCounts = (): { pending: number; reviewed: number; flagged: number } => {
    const counts = { pending: 0, reviewed: 0, flagged: 0 };
    const validStatuses = ["pending", "reviewed", "flagged"] as const;
    responses.forEach((r) => {
      const status = r.reviewStatus;
      if (validStatuses.includes(status)) {
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

      const htmlContent = `
        <html><body style="font-family: Arial; padding: 20px;">
          <h1>Survey Responses</h1>
          ${htmlRows}
        </body></html>`;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to export PDF");
    }
  };

  const statusCounts = getStatusCounts();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
        {!selectedFormId ? (
          <>
            <Text className="text-xl font-bold mb-4 text-center">Select a Form</Text>
            {loading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#6D28D9" />
                <Text className="text-purple-700 mt-2">Loading forms...</Text>
              </View>
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
                  <Text className="text-lg font-semibold text-purple-900">
                    {form.title}
                  </Text>
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

            <View className="flex-row justify-around mb-4 mt-4">
              {["all", "pending", "reviewed", "flagged"].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => {
                    setStatusFilter(status);
                    fetchResponses(selectedFormId, status);
                  }}
                  className={`px-4 py-2 rounded-full ${statusFilter === status ? "bg-purple-600" : "bg-gray-200"}`}
                >
                  <Text className={`text-sm font-bold ${statusFilter === status ? "text-white" : "text-black"}`}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <MapView
              className="h-56 rounded-xl mb-4"
              initialRegion={{
                latitude: 23.8103,
                longitude: 90.4125,
                latitudeDelta: 5,
                longitudeDelta: 5,
              }}
            >
              {responses.map((res, idx) => (
                res.respondentDetails?.latitude && res.respondentDetails?.longitude && (
                  <Marker
                    key={idx}
                    coordinate={{
                      latitude: parseFloat(res.respondentDetails.latitude),
                      longitude: parseFloat(res.respondentDetails.longitude)
                    }}
                    title={res.respondentDetails.name || `#${idx + 1}`}
                    description={res.surveyName || "Untitled"}
                  />
                )
              ))}
            </MapView>

            {loading ? (
              <ActivityIndicator size="large" color="#6D28D9" />
            ) : responses.length === 0 ? (
              <Text className="text-center text-gray-500">No responses found</Text>
            ) : (
              responses.map((res, idx) => (
                <View key={idx} className="border rounded-xl p-4 mb-4 bg-gray-50">
                  <Text className="font-semibold mb-1 text-purple-800">
                    #{idx + 1} - {res.respondentDetails?.name || "Unknown"}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    Division: {res.respondentDetails?.division || "N/A"} | District: {res.respondentDetails?.district || "N/A"}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    Survey: {res.surveyName || "Untitled"}
                  </Text>
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

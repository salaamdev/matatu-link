// src/screens/profile/tabs/ReportsTab.jsx

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { getTableData, getAllReportsData } from "../../../api/pdf_reports";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useAuth } from "../../../contexts/AuthContext";

const ReportsTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Define the tables available for reports
  const tables = [
    { name: "routes", displayName: "Routes" },
    { name: "matatus", displayName: "Matatus" },
    { name: "users", displayName: "Users" },
    { name: "contributions", displayName: "Contributions" },
    { name: "reports", displayName: "Reports" },
    // Add more tables as necessary
  ];

  // Function to generate PDF report for a specific table
  const generatePdfReport = async (tableName, displayName) => {
    setLoading(true);
    try {
      const data = await getTableData(tableName);
      if (data.length === 0) {
        Alert.alert(
          "No Data",
          `There is no data available for ${displayName}.`
        );
        return;
      }
      const headers = Object.keys(data[0]);
      const htmlRows = data
        .map((row) => {
          return `<tr>${headers
            .map((header) => `<td>${row[header]}</td>`)
            .join("")}</tr>`;
        })
        .join("");

      const htmlContent = `
        <html>
          <head>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${displayName} Report</h1>
            <table>
              <thead>
                <tr>${headers
                  .map((header) => `<th>${header}</th>`)
                  .join("")}</tr>
              </thead>
              <tbody>
                ${htmlRows}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error generating PDF report:", error.message);
      Alert.alert("Error", "Failed to generate PDF report.");
    } finally {
      setLoading(false);
    }
  };

  // Function to convert JSON to CSV
  const convertToCSV = (objArray) => {
    if (objArray.length === 0) {
      return "";
    }
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";

    // Get headers
    const headers = Object.keys(array[0]);
    row = headers.join(",") + "\r\n";
    str += row;

    // Loop through rows
    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";

        // Escape double quotes in the cell value
        let cell = array[i][index];
        if (typeof cell === "string") {
          cell = cell.replace(/"/g, '""');
          // Wrap cell in double quotes if it contains comma or double quotes
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
        }
        line += cell;
      }
      str += line + "\r\n";
    }

    return str;
  };

  // Function to generate Excel (CSV) report for a specific table
  const generateExcelReport = async (tableName, displayName) => {
    setLoading(true);
    try {
      const data = await getTableData(tableName);
      if (data.length === 0) {
        Alert.alert(
          "No Data",
          `There is no data available for ${displayName}.`
        );
        return;
      }
      const csvString = convertToCSV(data);
      const fileUri = FileSystem.documentDirectory + `${table.name}_report.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error generating Excel report:", error.message);
      Alert.alert("Error", "Failed to generate Excel report.");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate all reports as individual PDFs and/or Excel files
  const generateAllReports = async () => {
    setLoading(true);
    try {
      const data = await getAllReportsData();
      // For each table, generate PDF and Excel
      for (const table of tables) {
        const tableData = data[table.name];
        if (tableData && tableData.length > 0) {
          // Generate PDF
          const headers = Object.keys(tableData[0]);
          const htmlRows = tableData
            .map((row) => {
              return `<tr>${headers
                .map((header) => `<td>${row[header]}</td>`)
                .join("")}</tr>`;
            })
            .join("");

          const htmlContent = `
            <html>
              <head>
                <style>
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #dddddd; text-align: left; padding: 8px; }
                  th { background-color: #f2f2f2; }
                </style>
              </head>
              <body>
                <h1>${table.displayName} Report</h1>
                <table>
                  <thead>
                    <tr>${headers
                      .map((header) => `<th>${header}</th>`)
                      .join("")}</tr>
                  </thead>
                  <tbody>
                    ${htmlRows}
                  </tbody>
                </table>
              </body>
            </html>
          `;

          const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false,
          });

          await Sharing.shareAsync(uri);

          // Generate Excel (CSV)
          const csvString = convertToCSV(tableData);
          const fileUri =
            FileSystem.documentDirectory + `${table.name}_report.csv`;
          await FileSystem.writeAsStringAsync(fileUri, csvString, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert(
            "No Data",
            `There is no data available for ${table.displayName}.`
          );
        }
      }
    } catch (error) {
      console.error("Error generating all reports:", error.message);
      Alert.alert("Error", "Failed to generate all reports.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Generate Reports</Text>

      {/* Individual Report Generation Buttons */}
      {tables.map((table) => (
        <View key={table.name} style={styles.buttonContainer}>
          <Text style={styles.tableName}>{table.displayName}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              onPress={() => generatePdfReport(table.name, table.displayName)}
              style={styles.button}
              icon="file-pdf-box"
            >
              PDF
            </Button>
            <Button
              mode="contained"
              onPress={() => generateExcelReport(table.name, table.displayName)}
              style={styles.button}
              icon="file-excel-box"
            >
              Excel
            </Button>
          </View>
        </View>
      ))}

      {/* Generate All Reports Button */}
      <View style={styles.allButtonContainer}>
        <Button
          mode="contained"
          onPress={generateAllReports}
          style={styles.allButton}
          icon="file-document-multiple"
          color="#FF9500"
        >
          Generate All Reports
        </Button>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loading}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007AFF",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  tableName: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333333",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginRight: 10,
  },
  allButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  allButton: {
    width: "80%",
    padding: 10,
  },
  loading: {
    marginTop: 20,
  },
});

export default ReportsTab;

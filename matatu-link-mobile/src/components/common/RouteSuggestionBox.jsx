//src/screens/home/components/RouteSuggestionBox.jsx

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Text,
  Button,
  Chip,
  TextInput,
  Portal,
  Modal,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import {initiatePayment} from "../../api/payment";

const phoneValidationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^(?:\+254|0)?[71]\d{8}$/, "Enter a valid Kenyan phone number")
    .required("Phone number is required"),
});

const RouteSuggestionBox = ({ routeInfo, onClose }) => {
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [payLaterModalVisible, setPayLaterModalVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema: phoneValidationSchema,
    onSubmit: (values) => {
      handleBookingComplete(values.phoneNumber);
    },
  });

  const handleBookingComplete = async (phoneNumber) => {
    try {
      // Format phone number to match M-Pesa requirements (254XXXXXXXXX)
      const formattedPhone = phoneNumber.startsWith("0")
        ? `254${phoneNumber.slice(1)}`
        : phoneNumber.startsWith("+254")
        ? phoneNumber.slice(1)
        : phoneNumber.startsWith("254")
        ? phoneNumber
        : `254${phoneNumber}`;

      // Validate phone number format before making the request
      if (!/^254[17]\d{8}$/.test(formattedPhone)) {
        throw new Error(
          "Invalid phone number format. Please use format: 07XXXXXXXX"
        );
      }

      console.log("Initiating payment with:", {
        phone: formattedPhone,
        amount: routeInfo.fare,
      });

      const response = await initiatePayment({
        phone_number: formattedPhone,
        amount: parseFloat(routeInfo.fare),
      });

      console.log("Payment response:", response);

      Alert.alert(
        "Payment Initiated",
        "Please check your phone for the M-Pesa payment prompt",
        [{ text: "OK", onPress: () => setBookingModalVisible(false) }]
      );
    } catch (error) {
      console.error("Payment error:", error.response?.data || error);
      Alert.alert(
        "Payment Failed",
        error.response?.data?.error ||
          error.message ||
          "Failed to initiate payment. Please try again."
      );
    }
  };

  // const handleBookingComplete = async (phoneNumber) => {
  //   try {
  //     // Format phone number to match M-Pesa requirements
  //     const formattedPhone = phoneNumber.startsWith("0") ? `254${phoneNumber.slice(1)}` : phoneNumber;

  //     // Initiate M-Pesa payment
  //     await initiatePayment({
  //       phone_number: formattedPhone,
  //       amount: parseFloat(routeInfo.fare),
  //     });

      // Only show success message after payment is initiated
  //     Alert.alert(
  //       "Payment Initiated",
  //       "Please check your phone for the M-Pesa payment prompt. Your ride will be confirmed once payment is complete.",
  //       [{ text: "OK", onPress: () => setBookingModalVisible(false) }]
  //     );
  //   } catch (error) {
  //     Alert.alert(
  //       "Payment Failed",
  //       error.response?.data?.error || "Failed to initiate payment. Please try again."
  //     );
  //   }
  // };

  const renderBookingModal = () => (
    <Portal>
      <Modal
        visible={bookingModalVisible}
        onDismiss={() => setBookingModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Book Your Ride</Text>
        <Text style={styles.modalText}>
          Amount to pay: KES {routeInfo.fare}
        </Text>
        <TextInput
          label="M-Pesa Number"
          value={formik.values.phoneNumber}
          onChangeText={formik.handleChange("phoneNumber")}
          onBlur={formik.handleBlur("phoneNumber")}
          error={formik.touched.phoneNumber && formik.errors.phoneNumber}
          mode="outlined"
          style={styles.input}
          placeholder="07XXXXXXXX"
          keyboardType="phone-pad"
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <Text style={styles.errorText}>{formik.errors.phoneNumber}</Text>
        )}
        <Button
          mode="contained"
          onPress={formik.handleSubmit}
          style={styles.modalButton}
        >
          Proceed to Pay
        </Button>
      </Modal>
    </Portal>
  );

  const renderPayLaterModal = () => (
    <Portal>
      <Modal
        visible={payLaterModalVisible}
        onDismiss={() => setPayLaterModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Pay On Arrival</Text>
        <Text style={styles.modalText}>
          Your matatu will arrive in approximately 20 minutes.
        </Text>
        <Text style={styles.paymentInfo}>
          Payment Options:{"\n"}
          M-Pesa Till: 123456{"\n"}
          Buy Goods: 987654{"\n"}
          Amount: KES {routeInfo.fare}
        </Text>
        <Button
          mode="contained"
          onPress={() => setPayLaterModalVisible(false)}
          style={styles.modalButton}
        >
          Got It
        </Button>
      </Modal>
    </Portal>
  );

  if (!routeInfo) return null;

  return (
    <>
      <Card style={styles.container}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Available Route</Text>
            <MaterialIcons
              name="close"
              size={24}
              color="#666"
              onPress={onClose}
            />
          </View>

          <View style={styles.routeInfo}>
            <Chip icon="bus" mode="outlined" style={styles.chip}>
              {routeInfo.matatuNumber}
            </Chip>
            <Text style={styles.route}>
              Route {routeInfo.routeNumber}: {routeInfo.routeName}
            </Text>
          </View>

          <ScrollView style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <MaterialIcons name="attach-money" size={20} color="#34C759" />
              <Text style={styles.detailText}>Fare: KES {routeInfo.fare}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={20} color="#007AFF" />
              <Text style={styles.detailText}>
                Est. Time: {routeInfo.duration}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="route" size={20} color="#FF9500" />
              <Text style={styles.detailText}>
                Via: {routeInfo.viaPoints.join(" → ")}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcons name="info" size={20} color="#FF3B30" />
              <Text style={styles.detailText}>{routeInfo.additionalInfo}</Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={[styles.button, styles.bookButton]}
              onPress={() => setBookingModalVisible(true)}
            >
              Book Now
            </Button>
            <Button
              mode="outlined"
              style={[styles.button, styles.payLaterButton]}
              onPress={() => setPayLaterModalVisible(true)}
            >
              Pay on Arrival
            </Button>
          </View>
        </Card.Content>
      </Card>
      {renderBookingModal()}
      {renderPayLaterModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  routeInfo: {
    marginBottom: 16,
  },
  chip: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  route: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  detailsContainer: {
    maxHeight: 120,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  bookButton: {
    backgroundColor: "#34C759",
  },
  payLaterButton: {
    borderColor: "#007AFF",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  paymentInfo: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default RouteSuggestionBox;

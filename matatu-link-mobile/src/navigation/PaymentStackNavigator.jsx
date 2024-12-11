// src/navigation/PaymentStackNavigator.jsx
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import PaymentScreen from "../screens/profile/PaymentScreen";
import AddPaymentMethodScreen from "../screens/profile/AddPaymentMethodScreen";

const Stack = createStackNavigator();

const PaymentStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentMain"
        component={PaymentScreen}
        options={{ title: "Payment" }}
      />
      <Stack.Screen
        name="AddPaymentMethod"
        component={AddPaymentMethodScreen}
        options={{ title: "Add Payment Method" }}
      />
    </Stack.Navigator>
  );
};

export default PaymentStackNavigator;

import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

import { useStripe } from "@stripe/stripe-react-native";

const fetchPaymentSheetParams = async () => {
  // const response = await fetch(`${API_URL}/payment-sheet`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // const { paymentIntent, ephemeralKey, customer } = await response.json();

  return {
    paymentIntent: "12",
    ephemeralKey: "12",
    customer: "12",
    publishableKey: "123",
  };
};

export function Checkout() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = useCallback(async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  }, [initPaymentSheet]);

  const openPaymentSheet = async () => {
    // see below
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [initializePaymentSheet]);

  return null;
}

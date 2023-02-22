import * as React from "react";
import { useState, useMemo } from "react";
import { Platform } from "react-native";

import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";

import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Logger } from "app/lib/logger";

import { stripePromise } from "./stripe";

export function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const isDark = useIsDarkMode();
  const stripeOptions = useMemo(
    () =>
      ({
        clientSecret,
        appearance: {
          theme: isDark ? "night" : "stripe",
        },
      } as const),
    [clientSecret, isDark]
  );

  return stripeOptions?.clientSecret ? (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <CheckoutFormStripe />
    </Elements>
  ) : null;
}

const CheckoutFormStripe = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [setAsDefaultPaymentMethod, setSetAsDefaultPaymentMethod] =
    useState(true);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          Platform.select({
            web: window.location.origin,
            default: "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
          }) +
          "/checkout-return?setAsDefaultPaymentMethod=" +
          setAsDefaultPaymentMethod,
        receipt_email: email,
      },
    });

    if (error) {
      Logger.error("Stripe payment failure ", error);
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "An unexpected error occurred.");
      } else {
        setMessage("An unexpected error occurred. Please try again");
      }
    }

    setIsLoading(false);
  };

  return (
    <View tw="min-h-[380px] justify-end p-4" nativeID="payment-form">
      <LinkAuthenticationElement
        className="PaymentElement"
        onChange={(e) => setEmail(e.value.email)}
      />
      <View tw="h-3" />
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      <View tw="h-4" />
      <View tw="flex-row items-center">
        <Checkbox
          checked={setAsDefaultPaymentMethod}
          onChange={() =>
            setSetAsDefaultPaymentMethod(!setAsDefaultPaymentMethod)
          }
          accesibilityLabel="Set as default payment method"
        />
        <Text
          tw="ml-2 text-gray-900 dark:text-gray-50"
          onPress={() =>
            setSetAsDefaultPaymentMethod(!setAsDefaultPaymentMethod)
          }
        >
          Set as default payment method
        </Text>
      </View>

      <View tw="h-6" />
      <Button
        disabled={isLoading || !stripe || !elements}
        onPress={handleSubmit}
        size="regular"
      >
        Submit
      </Button>
      {message ? <Text tw="pt-4 text-red-500">{message}</Text> : null}
    </View>
  );
};

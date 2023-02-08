import * as React from "react";
import { useEffect, useState } from "react";

import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Logger } from "app/lib/logger";

import { stripePromise } from "./stripe";

const CheckoutFormStripe = () => {
  const stripe = useStripe();
  const elements = useElements();

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
        return_url: window.location.origin + "/checkout-return",
        receipt_email: email,
      },
    });

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
      <View tw="h-8" />
      <Button
        disabled={isLoading || !stripe || !elements}
        onPress={handleSubmit}
      >
        Submit
      </Button>
      {message ? <Text tw="pt-4 text-red-500">{message}</Text> : null}
    </View>
  );
};

export function CheckoutForm({ paymentIntent }: { paymentIntent: string }) {
  const [options, setOptions] = useState<stripeJs.StripeElementsOptions>();
  const isDark = useIsDarkMode();

  useEffect(() => {
    async function fetchClientSecret() {
      // const res = await axios({
      //   url: "/v1/stripe/secret",
      //   method: "GET",
      // });
      setOptions((p) => ({
        ...p,
        clientSecret:
          "pi_3MZ6SsAgQah8GEw204rsiRD2_secret_5upYTsdYmcXE7E5ihfeKDyMLN",
      }));
    }
    fetchClientSecret();
  }, [paymentIntent]);

  useEffect(() => {
    setOptions((p) => ({
      ...p,
      appearance: {
        theme: isDark ? "night" : "stripe",
      },
    }));
  }, [isDark]);

  return options?.clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutFormStripe />
    </Elements>
  ) : null;
}

import { useEffect, useState } from "react";

import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

// @ts-ignore
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
    });

    console.log("errorr ", error);
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <View tw="p-4" nativeID="payment-form">
      <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
      <View tw="h-3" />
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />
      <View tw="h-4" />
      <Button
        disabled={isLoading || !stripe || !elements}
        onPress={handleSubmit}
      >
        Submit
      </Button>
      {message && <Text>{message}</Text>}
    </View>
  );
};

export function Checkout() {
  const [options, setOptions] = useState<stripeJs.StripeElementsOptions>();
  useEffect(() => {
    async function fetchClientSecret() {
      // const res = await axios({
      //   url: "/v1/stripe/secret",
      //   method: "GET",
      // });
      setOptions({
        clientSecret:
          "pi_3MXOdRAgQah8GEw21whPCZLr_secret_1Zrrj0lfsjY6z8ESbJl84XXY8",
      });
    }
    fetchClientSecret();
  }, []);

  return options ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  ) : null;
}

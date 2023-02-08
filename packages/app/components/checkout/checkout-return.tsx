import { useEffect, useState } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { stripePromise } from "./stripe";

const REDIRECT_SECONDS = 5;

export const CheckoutReturn = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "failed" | "success" | "processing" | null
  >(null);
  const router = useRouter();
  const [time, setTime] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    setIsLoading(true);
    stripePromise?.then((stripe) => {
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );
      if (!stripe) {
        return;
      }
      if (!clientSecret) {
        return;
      }

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        setIsLoading(false);

        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            setPaymentStatus("success");
            setTimeout(() => {
              router.replace("/drop");
            }, REDIRECT_SECONDS * 1000);
            setInterval(() => {
              setTime((time) => time - 1);
            }, 1000);
            break;
          case "processing":
            setMessage("Your payment is processing.");
            setPaymentStatus("processing");
            break;
          case "requires_payment_method":
            setPaymentStatus("failed");
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setPaymentStatus("failed");
            setMessage("Something went wrong.");
            break;
        }
      });
    });
  }, [router]);

  return (
    <View tw="items-center p-4">
      {isLoading ? <Spinner size="lg" /> : null}

      {paymentStatus === "success" ? (
        <>
          <Text tw="text-4xl font-bold">Success 🎉</Text>
          <Text tw="p-8 text-center text-base">
            Redirecting back in {time} second
            {time > 1 ? "s" : ""}.
          </Text>
        </>
      ) : null}

      {paymentStatus === "processing" ? (
        <>
          <Text tw="text-4xl font-bold">Processing Payment</Text>
          <Text tw="p-8 text-center text-base">{message}</Text>
        </>
      ) : null}

      {paymentStatus === "failed" ? (
        <>
          <Text tw="text-4xl font-bold">Payment Failed</Text>
          <Text tw="p-8 text-center text-base">{message}</Text>
        </>
      ) : null}
    </View>
  );
};

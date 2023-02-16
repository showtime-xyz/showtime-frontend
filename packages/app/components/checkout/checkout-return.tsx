import { useEffect, useState, useCallback } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { delay } from "app/utilities";

import { dropAutoSubmitConfig } from "../drop/utils";
import { stripePromise } from "./stripe";

const REDIRECT_SECONDS = 5;

export const CheckoutReturn = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useUser();
  const [paymentStatus, setPaymentStatus] = useState<
    "failed" | "success" | "processing" | null | "notSure"
  >(null);
  const router = useRouter();
  const [time, setTime] = useState(REDIRECT_SECONDS);

  const handlePaymentSuccess = useCallback(async () => {
    setMessage("Payment succeeded!");
    setPaymentStatus("success");
    mutate();
    setTimeout(() => {
      router.replace("/drop/free");
      dropAutoSubmitConfig.shouldAutoSubmit = true;
    }, REDIRECT_SECONDS * 1000);
    setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : 0));
    }, 1000);
  }, [router, mutate]);

  useEffect(() => {
    async function confirmPaymentStatus() {
      try {
        setIsLoading(true);
        const stripe = await stripePromise;

        const clientSecret = new URLSearchParams(window.location.search).get(
          "payment_intent_client_secret"
        );
        if (!stripe) {
          return;
        }
        if (!clientSecret) {
          return;
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret
        );

        setIsLoading(false);

        // https://stripe.com/docs/payments/intents
        switch (paymentIntent?.status) {
          case "succeeded":
            handlePaymentSuccess();
            break;
          case "processing":
            {
              setMessage("Your payment is processing.");
              setPaymentStatus("processing");
              for (let i = 0; i < 20; i++) {
                const res = await axios({
                  method: "GET",
                  url:
                    "/v1/payments/status?payment_intent_id=" + paymentIntent.id,
                });
                if (res.current_status === "succeeded") {
                  handlePaymentSuccess();
                  return;
                } else if (res.current_status === "requires_payment_method") {
                  setPaymentStatus("failed");
                  setMessage(
                    "Your payment was not successful, please try again."
                  );
                  return;
                }
                await delay(3000);
              }

              setPaymentStatus("notSure");
              setMessage(
                "Please check back later to see if your payment went through."
              );
            }
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
      } catch (error) {
        Logger.error("Error confirming payment status", error);
        setPaymentStatus("notSure");
        setMessage(
          "Please check back later to see if your payment went through."
        );
      }
    }

    confirmPaymentStatus();
  }, [router, handlePaymentSuccess]);

  return (
    <View tw="items-center p-4">
      {isLoading ? <Spinner size="large" /> : null}

      {paymentStatus === "success" ? (
        <>
          <Text tw="text-4xl font-bold text-gray-900 dark:text-gray-50">
            Payment Succeeded 🎉
          </Text>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            Redirecting back in {time} second
            {time > 1 ? "s" : ""}.
          </Text>
        </>
      ) : null}

      {paymentStatus === "processing" ? (
        <>
          <Text tw="text-4xl font-bold text-gray-900 dark:text-gray-50">
            Processing Payment
          </Text>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            {message}
          </Text>
        </>
      ) : null}

      {paymentStatus === "failed" ? (
        <View>
          <Text tw="text-4xl font-bold text-gray-900 dark:text-gray-50">
            Payment Failed
          </Text>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            {message}
          </Text>
          <Button
            onPress={() => {
              router.replace("/checkout");
            }}
            size="regular"
          >
            Restart Payment
          </Button>
        </View>
      ) : null}

      {paymentStatus === "notSure" ? (
        <>
          <Text tw=" text-4xl font-bold text-gray-900 dark:text-gray-50">
            Something went wrong
          </Text>
          <Text tw="p-8 text-center text-base text-gray-900 dark:text-gray-50">
            {message}
          </Text>
        </>
      ) : null}
    </View>
  );
};

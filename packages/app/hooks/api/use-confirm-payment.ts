import { useState, useCallback } from "react";
import { Platform } from "react-native";

import { stripePromise } from "app/components/checkout/stripe";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { delay } from "app/utilities";

export const useConfirmPayment = () => {
  const [paymentStatus, setPaymentStatus] = useState<
    "failed" | "success" | "processing" | null | "notSure"
  >(null);
  const [message, setMessage] = useState<string | null>(null);
  const { mutate } = useUser();

  const confirmPaymentStatus = useCallback(
    async function confirmPaymentStatus(paymentIntentId: string) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<void>(async (resolve, reject) => {
        try {
          setMessage("Your payment is processing.");
          setPaymentStatus("processing");
          for (let i = 0; i < 20; i++) {
            await delay(3000);
            const res = await axios({
              method: "GET",
              url:
                "/v1/payments/drops/status?payment_intent_id=" +
                paymentIntentId,
            });
            if (res.current_status === "succeeded") {
              setPaymentStatus("success");
              setMessage("Your payment was successful.");
              mutate();
              resolve();
              return;
            } else if (res.current_status === "requires_payment_method") {
              setPaymentStatus("failed");
              reject();
              setMessage("Your payment was not successful, please try again.");
              return;
            }
          }
          reject();
          setPaymentStatus("notSure");
          setMessage(
            "Please check back later to see if your payment went through."
          );
        } catch (error) {
          Logger.error("Error confirming payment status", error);
          setPaymentStatus("notSure");
          setMessage(
            "Please check back later to see if your payment went through."
          );
          reject();
        }
      });
    },
    [mutate]
  );

  const confirmCardPaymentStatus = useCallback(
    async function confirmCardPaymentStatus(
      clientSecret: string,
      paymentMethodId: string
    ) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise<void>(async (resolve, reject) => {
        try {
          setMessage("Your payment is processing.");
          setPaymentStatus("processing");
          const stripe = await stripePromise();

          const paymentResponse = await stripe?.confirmCardPayment(
            clientSecret,
            {
              payment_method: paymentMethodId,
              return_url:
                Platform.select({
                  web: window.location.origin,
                  default: "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
                }) + "/checkout-return",
            }
          );
          if (paymentResponse?.error) {
            Logger.error(
              "Error confirming card payment status",
              paymentResponse.error
            );
            setPaymentStatus("failed");
            setMessage(paymentResponse.error.message ?? "Something went wrong");
            reject();
          }

          if (paymentResponse?.paymentIntent) {
            await confirmPaymentStatus(paymentResponse?.paymentIntent.id);
            resolve();
          }
        } catch (e) {
          reject(e);
          Logger.error(e);
        }
      });
    },
    [confirmPaymentStatus]
  );

  return {
    paymentStatus,
    message,
    confirmPaymentStatus,
    confirmCardPaymentStatus,
  };
};

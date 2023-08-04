import { useEffect, useState, useCallback } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useConfirmPayment } from "app/hooks/api/use-confirm-payment";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";

import { stripePromise } from "./stripe";

const REDIRECT_SECONDS = 5;

export const CheckoutReturn = () => {
  const router = useRouter();
  const [time, setTime] = useState(REDIRECT_SECONDS);
  const { setPaymentByDefault } = usePaymentsManage();
  const { paymentStatus, message, confirmPaymentStatus } = useConfirmPayment();
  const handlePaymentSuccess = useCallback(async () => {
    setTimeout(() => {
      router.replace("/drop/free?checkoutSuccess=true");
    }, REDIRECT_SECONDS * 1000);
    setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : 0));
    }, 1000);

    const setAsDefaultPaymentMethod = new URLSearchParams(
      window.location.search
    ).get("setAsDefaultPaymentMethod");

    const stripe = await stripePromise();

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (stripe && clientSecret) {
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );

      if (
        setAsDefaultPaymentMethod === "true" &&
        typeof paymentIntent?.payment_method === "string"
      ) {
        setPaymentByDefault(paymentIntent.payment_method);
      }
    }
  }, [router, setPaymentByDefault]);

  useEffect(() => {
    const paymentIntentId = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    if (paymentIntentId) {
      confirmPaymentStatus(paymentIntentId).then(handlePaymentSuccess);
    }
  }, [router, confirmPaymentStatus, handlePaymentSuccess]);

  return (
    <View tw="items-center p-4">
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
          <View tw="flex-row">
            <Text tw="text-4xl font-bold text-gray-900 dark:text-gray-50">
              Processing Payment
            </Text>
            <View tw="ml-4">
              <Spinner />
            </View>
          </View>
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

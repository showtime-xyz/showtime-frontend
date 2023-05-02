import { useState, useCallback } from "react";

import { ClientSideOnly } from "@showtime-xyz/universal.client-side-only";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { stripePromise } from "app/components/checkout//stripe";
import { useConfirmPayment } from "app/hooks/api/use-confirm-payment";
import { setPaymentByDefaultFetch } from "app/hooks/api/use-payments-manage";
import { useIsomorphicLayoutEffect } from "app/hooks/use-isomorphic-layout-effect";

import { toast } from "design-system/toast";

import { DropFree as OriginDropFree } from "./drop-free";

export const DropFree = () => {
  const [isHasPaymentIntentId, setIsHasPaymentIntentId] = useState(false);
  const router = useRouter();
  const { paymentStatus, confirmPaymentStatus } = useConfirmPayment();
  const handlePaymentSuccess = useCallback(async () => {
    router.replace("/drop/free?checkoutSuccess=true");

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
        setPaymentByDefaultFetch(paymentIntent.payment_method);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPaymentByDefaultFetch]);

  useIsomorphicLayoutEffect(() => {
    const paymentIntentId = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );
    if (paymentIntentId) {
      setIsHasPaymentIntentId(true);
      setTimeout(() => {
        toast.promise(confirmPaymentStatus(paymentIntentId), {
          loading: "Processing Payment...",
          success: () => {
            handlePaymentSuccess();
            return "Now preview your drop";
          },
          error: "Please check back later to see if your payment went through.",
        });
      }, 800);
    }
  }, [confirmPaymentStatus, handlePaymentSuccess]);

  return (
    <>
      <OriginDropFree />
      {isHasPaymentIntentId && paymentStatus !== "success" && (
        <View tw="absolute inset-0 items-center justify-center bg-black/30 p-4">
          <View tw="ml-4">
            <Spinner />
          </View>
        </View>
      )}
    </>
  );
};

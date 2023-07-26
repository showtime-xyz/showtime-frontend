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
import type { StripeError } from "@stripe/stripe-js";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { Logger } from "app/lib/logger";
import { TextLink } from "app/navigation/link";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { ThreeDotsAnimation } from "design-system/three-dots";
import { toast } from "design-system/toast";

import { stripePromise } from "./stripe";

export function CheckoutClaimForm({
  clientSecret,
  contractAddress,
  stripeAccount,
}: {
  clientSecret: string;
  contractAddress: string;
  stripeAccount: string;
}) {
  const { data: edition, loading } =
    useCreatorCollectionDetail(contractAddress);

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

  return stripeOptions?.clientSecret && edition ? (
    <Elements stripe={stripePromise({ stripeAccount })} options={stripeOptions}>
      <CheckoutForm edition={edition} clientSecret={clientSecret} />
    </Elements>
  ) : null;
}

const CheckoutForm = ({
  edition,
  clientSecret,
}: {
  edition: CreatorEditionResponse;
  clientSecret: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const isDark = useIsDarkMode();

  const [setAsDefaultPaymentMethod, setSetAsDefaultPaymentMethod] =
    useState(true);
  const [email, setEmail] = useState("");
  const { data: nft } = useNFTDetailByTokenId({
    chainName: process.env.NEXT_PUBLIC_CHAIN_ID,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      Logger.error("Stripe payment failure ", submitError);
      return;
    }

    setIsLoading(true);

    const fetch = new Promise((resolve, reject) => {
      const stripeFetch = stripe
        .confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url:
              Platform.select({
                web: window.location.href,
                default: "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
              }) +
              `?unlockedChannelModal=true&contractAddress=${edition.creator_airdrop_edition?.contract_address}&isPaid=true`,
            receipt_email: email,
          },
        })
        .then(async (rest) => {
          if (rest.error) {
            Logger.error("Stripe payment failure ", rest.error);
            reject(rest.error);
          } else {
            resolve(undefined);
          }
        });
      return stripeFetch;
    }).finally(() => {
      setIsLoading(false);
    });
    toast.promise(fetch, {
      loading: "Processing Payment...",
      success: "Redirecting",
      error: (error: StripeError) => {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
          return error.message ?? "An unexpected error occurred.";
        } else {
          return "An unexpected error occurred. Please try again";
        }
      },
    });
  };

  return (
    <>
      <View tw="" id="payment-form">
        <View tw="p-4">
          <View tw="flex-row">
            <View tw="relative overflow-hidden rounded-2xl">
              <Media
                isMuted
                item={nft?.data.item}
                sizeStyle={{
                  width: 80,
                  height: 80,
                }}
              />
            </View>
            <View tw="ml-4 flex-1 justify-center">
              <Text
                tw="text-xl font-bold text-black dark:text-white"
                numberOfLines={2}
              >
                {edition?.creator_airdrop_edition.name}
              </Text>
              <View tw="h-2" />
              <Text tw="text-gray-700 dark:text-gray-400">
                {getCreatorUsernameFromNFT(nft?.data.item)}
              </Text>
            </View>
          </View>
          <View tw="h-6" />
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
          <View tw="h-3" />

          <PaymentElement
            options={{
              layout: "tabs",

              wallets: {
                applePay: "auto",
                googlePay: "auto",
              },
            }}
          />
          <View tw="h-4" />
          <View tw="px-4">
            <Text
              tw="text-center text-xs text-gray-900 dark:text-gray-50"
              onPress={() =>
                setSetAsDefaultPaymentMethod(!setAsDefaultPaymentMethod)
              }
            >
              By clicking submit you will accept the{" "}
              <TextLink
                href="https://showtime-xyz.notion.site/Legal-Public-c407e36eb7cd414ca190245ca8621e68"
                tw="font-bold"
                target="_blank"
              >
                Terms & Conditions
              </TextLink>{" "}
              and understand that you are purchasing a non-refundable digital
              item.
            </Text>
          </View>
          {/* <View tw="flex-row items-center">
            <Checkbox
              checked={setAsDefaultPaymentMethod}
              onChange={() =>
                setSetAsDefaultPaymentMethod(!setAsDefaultPaymentMethod)
              }
              aria-label="Set as default payment method"
            />
            <Text
              tw="ml-2 text-gray-900 dark:text-gray-50"
              onPress={() =>
                setSetAsDefaultPaymentMethod(!setAsDefaultPaymentMethod)
              }
            >
              I accept the <Text tw="font-bold">Terms of Service</Text> and
              understand that I am purchasing a non-refundable digital item.
            </Text>
          </View> */}
          {isLoading && (
            <View tw="animate-fade-in-250 absolute inset-0 items-center justify-center bg-black/30">
              <Spinner />
            </View>
          )}
        </View>

        <View tw="px-4 pt-4">
          <Button
            disabled={isLoading || !stripe || !elements}
            tw={`${isLoading || !stripe || !elements ? "opacity-60" : ""}`}
            onPress={handleSubmit}
            size="regular"
          >
            {isLoading ? (
              <Text tw="animate-fade-in-250 text-sm font-semibold">
                Submitting
                <ThreeDotsAnimation
                  color={isDark ? colors.black : colors.white}
                />
              </Text>
            ) : (
              "Submit"
            )}
          </Button>
        </View>
      </View>
    </>
  );
};

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
import uniq from "lodash/union";

import { AnimateHeight } from "@showtime-xyz/universal.accordion";
import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreditCard, CheckFilled } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Media } from "app/components/media";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import {
  CreatorEditionResponse,
  useCreatorCollectionDetail,
} from "app/hooks/use-creator-collection-detail";
import { useNFTDetailByTokenId } from "app/hooks/use-nft-detail-by-token-id";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { Logger } from "app/lib/logger";
import { Link as NavLink } from "app/navigation/link";
import { TextLink } from "app/navigation/link";
import {
  formatWalletNameToUpperCase,
  getCreatorUsernameFromNFT,
  getCurrencyPrice,
} from "app/utilities";

import { ThreeDotsAnimation } from "design-system/three-dots";
import { toast } from "design-system/toast";

import { EmptyPlaceholder } from "../empty-placeholder";
import { stripePromise } from "./stripe";

export function CheckoutClaimForm({
  clientSecret,
  contractAddress,
}: {
  clientSecret: string;
  contractAddress: string;
}) {
  const { data: edition, loading } =
    useCreatorCollectionDetail(contractAddress);
  const isDark = useIsDarkMode();
  const router = useRouter();
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

  if (loading) {
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }
  if (!edition || !clientSecret)
    return (
      <View tw="min-h-[200px] flex-1 items-center justify-center">
        <EmptyPlaceholder
          title="Payment failed, please try again!"
          tw="mb-8"
          hideLoginBtn
        />
        <Button
          onPress={() => {
            router.pop();
          }}
        >
          Go Back
        </Button>
      </View>
    );

  return (
    <Elements stripe={stripePromise()} options={stripeOptions}>
      <CheckoutFormLayout edition={edition} clientSecret={clientSecret} />
    </Elements>
  );
}

const CheckoutFormLayout = ({
  edition,
  clientSecret,
}: {
  edition: CreatorEditionResponse;
  clientSecret: string;
}) => {
  const isDark = useIsDarkMode();
  const { data: nft } = useNFTDetailByTokenId({
    chainName: edition.chain_name,
    tokenId: "0",
    contractAddress: edition?.creator_airdrop_edition.contract_address,
  });
  const router = useRouter();
  const paymentMethods = usePaymentsManage();
  const paymentMethodsList = useMemo(
    () => uniq(paymentMethods.data?.filter((f) => f.type == "card")),
    [paymentMethods.data]
  );
  const defaultPaymentMethod = useMemo(
    () => paymentMethods.data?.find((method) => method.is_default),
    [paymentMethods.data]
  );
  const [savedPaymentMethodId, setSavedPaymentMethodId] = useState<
    undefined | string
  >(defaultPaymentMethod?.id);
  const [isUseSavedCard, setIsUseSavedCard] = useState(true);
  const stripe = useStripe();
  const elements = useElements();

  const [setAsDefaultPaymentMethod, setSetAsDefaultPaymentMethod] =
    useState(true);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const paymentReturnUrl =
    Platform.select({
      web: window.location.href,
      default: "https://" + process.env.NEXT_PUBLIC_WEBSITE_DOMAIN,
    }) +
    `?checkoutReturnForPaidNFTModal=true&contractAddress=${
      edition.creator_airdrop_edition?.contract_address
    }&setAsDefaultPaymentMethod=${
      setAsDefaultPaymentMethod ? setAsDefaultPaymentMethod : ""
    }`;
  const paymentWithStripeFetch = async () => {
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
            return_url: paymentReturnUrl,
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
        if (
          error?.type === "card_error" ||
          error?.type === "validation_error"
        ) {
          return error.message ?? "An unexpected error occurred.";
        } else {
          Logger.error("Stripe payment failure ", error);
          return "An unexpected error occurred. Please try again";
        }
      },
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isUseSavedCard && savedPaymentMethodId && clientSecret) {
      setIsLoading(true);
      await stripe
        ?.confirmCardPayment(clientSecret, {
          payment_method: savedPaymentMethodId,
        })
        .then(async (res) => {
          router.push(
            {
              pathname: router.pathname,
              query: {
                ...router.query,
                contractAddress:
                  edition?.creator_airdrop_edition.contract_address,
                checkoutReturnForPaidNFTModal: true,
                paymentIntentId: res.paymentIntent?.id,
              },
            },
            router.asPath,
            {
              shallow: true,
            }
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      await paymentWithStripeFetch();
    }
  };
  return (
    <View tw="safe-bottom" id="payment-form">
      <View tw="px-4 pb-16 pt-4">
        <View tw="flex-row">
          <View tw="relative overflow-hidden rounded-2xl">
            {nft ? (
              <NavLink href={getNFTSlug(nft.data.item)}>
                <Media
                  isMuted
                  item={nft.data.item}
                  sizeStyle={{
                    width: 80,
                    height: 80,
                  }}
                />
              </NavLink>
            ) : null}
          </View>
          <View tw="ml-4 flex-1 justify-center">
            {nft ? (
              <NavLink href={getNFTSlug(nft.data.item)}>
                <Text
                  tw="text-xl font-bold text-black dark:text-white"
                  numberOfLines={2}
                >
                  {edition?.creator_airdrop_edition.name}
                </Text>
              </NavLink>
            ) : null}
            <View tw="h-2" />
            <Text tw="text-gray-700 dark:text-gray-400">
              {getCreatorUsernameFromNFT(nft?.data.item)}
            </Text>
          </View>
        </View>
        <View tw="h-6" />
        {!paymentMethods.isLoading &&
        paymentMethodsList &&
        paymentMethodsList?.length > 0 ? (
          <>
            {paymentMethodsList?.map((method) => {
              return (
                <View tw="mb-4" key={method.id}>
                  <PressableHover
                    onPress={() => {
                      setSavedPaymentMethodId(method.id);
                      setIsUseSavedCard(true);
                    }}
                    tw="flex-row items-center"
                  >
                    {method.id === savedPaymentMethodId && isUseSavedCard ? (
                      <CheckFilled
                        height={20}
                        width={20}
                        color={isDark ? colors.white : colors.gray[700]}
                      />
                    ) : (
                      <View tw="h-5 w-5 rounded-full border-[1px] border-gray-800 dark:border-gray-100" />
                    )}
                    <View tw="ml-2 self-start md:self-center">
                      <CreditCard
                        width={20}
                        height={20}
                        color={isDark ? colors.white : colors.black}
                      />
                    </View>
                    <View tw="ml-2 flex-row">
                      <Text tw="text-base font-medium text-gray-900 dark:text-gray-100">
                        {method?.is_default ? "Default Card" : "Card"}
                      </Text>
                      <Text tw="ml-1 text-sm font-medium text-gray-400">
                        {`(Ending in ${method.details.last4} · ${
                          method.details.exp_month
                        }/${method.details.exp_year?.toString().slice(-2)})`}
                        {method.details.wallet &&
                        (method.details.wallet as any)?.type ? (
                          <Text tw="text-13 ml-1">
                            from{" "}
                            {formatWalletNameToUpperCase(
                              (method.details.wallet as any).type
                            )}
                          </Text>
                        ) : null}
                      </Text>
                    </View>
                  </PressableHover>
                </View>
              );
            })}
            <PressableHover
              onPress={() => setIsUseSavedCard(false)}
              tw="mb-4 flex-row items-center"
            >
              {!isUseSavedCard ? (
                <CheckFilled
                  height={20}
                  width={20}
                  color={isDark ? colors.white : colors.gray[700]}
                />
              ) : (
                <View tw="h-5 w-5 rounded-full border-[1px] border-gray-800 dark:border-gray-100" />
              )}
              <View tw="ml-2 self-start md:self-center">
                <Image
                  source={{
                    uri: "https://media.showtime.xyz/assets/stripe-logo.png",
                  }}
                  height={20}
                  width={20}
                />
              </View>
              <View tw="ml-2 flex-row">
                <Text tw="text-base font-medium text-gray-900 dark:text-gray-100">
                  Other payment methods
                </Text>
              </View>
            </PressableHover>
            <AnimateHeight hide={isUseSavedCard}>
              <PaymentCustomPaymentForm
                setEmail={setEmail}
                setAsDefaultPaymentMethod={setAsDefaultPaymentMethod}
                setSetAsDefaultPaymentMethod={setSetAsDefaultPaymentMethod}
              />
            </AnimateHeight>
          </>
        ) : (
          <PaymentCustomPaymentForm
            setEmail={setEmail}
            setAsDefaultPaymentMethod={setAsDefaultPaymentMethod}
            setSetAsDefaultPaymentMethod={setSetAsDefaultPaymentMethod}
          />
        )}
        <View tw="mt-4 px-4">
          <Text tw="text-center text-xs text-gray-900 dark:text-gray-50">
            By clicking submit you will accept the{" "}
            <TextLink
              href="https://showtime-xyz.notion.site/Legal-Public-c407e36eb7cd414ca190245ca8621e68"
              tw="font-bold"
              target="_blank"
            >
              Terms & Conditions
            </TextLink>{" "}
            and understand that you are purchasing a non-refundable digital
            item. Final currency depends on creator bank. USD price may be
            estimated with latest rates. Currency fees may apply.
          </Text>
        </View>

        {isLoading && (
          <View tw="animate-fade-in-250 absolute inset-0 items-center justify-center bg-black/30">
            <Spinner />
          </View>
        )}
      </View>
      <View tw="safe-bottom fixed bottom-4 w-full px-4">
        <Button
          disabled={isLoading}
          tw={`${isLoading ? "opacity-60" : ""}`}
          onPress={handleSubmit}
          size="regular"
        >
          {isLoading ? (
            <Text tw="animate-fade-in-250 text-sm font-semibold">
              Processing
              <ThreeDotsAnimation
                color={isDark ? colors.black : colors.white}
              />
            </Text>
          ) : (
            `Collect to unlock - ${getCurrencyPrice(
              edition.usd_price ? "USD" : edition.currency,
              edition.usd_price ?? edition.price
            )}`
          )}
        </Button>
      </View>
    </View>
  );
};

const PaymentCustomPaymentForm = ({
  setEmail,
  setAsDefaultPaymentMethod,
  setSetAsDefaultPaymentMethod,
}: {
  setEmail: (v: string) => void;
  setAsDefaultPaymentMethod: boolean;
  setSetAsDefaultPaymentMethod: (v: boolean) => void;
}) => {
  return (
    <View>
      <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
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
      <View tw="mt-3 flex-row items-center">
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
          Set as default payment method
        </Text>
      </View>
    </View>
  );
};

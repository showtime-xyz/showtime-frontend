import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import { AxiosError } from "axios";
import useSWRMutation from "swr/mutation";

import { Button } from "@showtime-xyz/universal.button";
import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { CreditCard } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useConfirmPayment } from "app/hooks/api/use-confirm-payment";
import { usePaymentsManage } from "app/hooks/api/use-payments-manage";
import { DropPlan, usePaidDropPlans } from "app/hooks/use-paid-drop-plans";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { toast } from "design-system/toast";

export const SelectPlan = ({ setClientSecret }: { setClientSecret: any }) => {
  const paidDropPlansQuery = usePaidDropPlans();
  const [selectedPlan, setSelectedPlan] = useState<DropPlan | null>(null);
  const isDark = useIsDarkMode();
  const { trigger, isMutating, error } = useSWRMutation<{
    payment_intent_id: string;
    client_secret: string;
  }>(MY_INFO_ENDPOINT, fetchPaymentIntent);
  const [selectDefault, setSelectDefault] = useState(true);
  const paymentMethods = usePaymentsManage();
  const defaultPaymentMethod = useMemo(
    () => paymentMethods.data?.find((method) => method.is_default),
    [paymentMethods.data]
  );

  const router = useRouter();
  const {
    paymentStatus,
    confirmCardPaymentStatus,
    message: paymentStatusMessage,
  } = useConfirmPayment();

  useEffect(() => {
    // Sets initial selected plan
    if (paidDropPlansQuery.data && selectedPlan === null) {
      setSelectedPlan(paidDropPlansQuery.data[1]);
    }
  }, [paidDropPlansQuery?.data, selectedPlan]);
  const handleSelectPlan = async () => {
    if (!selectedPlan) return;

    try {
      if (selectDefault && defaultPaymentMethod) {
        const res = await trigger({
          dropPlan: selectedPlan,
          useDefaultPaymentMethod: true,
        });

        if (res?.client_secret) {
          try {
            await confirmCardPaymentStatus(
              res?.client_secret,
              defaultPaymentMethod.id
            );

            toast.success("Payment Succeeded");
            router.replace("/drop/free?checkoutSuccess=true");
          } catch (e) {
            // Error handled in hook
          }
        }
      } else {
        const res = await trigger({
          dropPlan: selectedPlan,
          useDefaultPaymentMethod: false,
        });

        setClientSecret(res?.client_secret);
      }
    } catch (e) {
      Logger.error(e);
    }
  };

  return (
    <View tw="p-4">
      {paidDropPlansQuery.isLoading ? (
        <View>
          <Skeleton width="100%" height={46} />
          <View tw="h-4" />
          <Skeleton width="100%" height={46} />
          <View tw="h-4" />
          <Skeleton width="100%" height={46} />
        </View>
      ) : paidDropPlansQuery.error ? (
        <ErrorText>Something went wrong. Please try again</ErrorText>
      ) : null}
      {paidDropPlansQuery.data?.map((plan) => {
        return (
          <Pressable
            key={plan.name}
            onPress={() => setSelectedPlan(plan)}
            tw="mb-4 flex-row items-center justify-between rounded-full bg-gray-100 p-4 dark:bg-gray-900"
            style={{
              // @ts-ignore
              background:
                selectedPlan?.name === plan.name
                  ? `linear-gradient(225deg, #FFFBEB 0%, #FDE68A 23.44%, #F59E0B 69.27%)`
                  : undefined,
            }}
          >
            <View tw="flex-row items-center">
              <Text
                tw={`font-space font-semibold ${
                  selectedPlan?.name === plan.name ? "" : "dark:text-gray-50"
                } text-gray-900`}
              >
                {plan.edition_size.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                edition drop
              </Text>
            </View>
            <Text
              tw={`font-space font-semibold ${
                selectedPlan?.name === plan.name ? "" : "dark:text-gray-50"
              } text-gray-900`}
            >
              ${plan.pricing / 100}
            </Text>
          </Pressable>
        );
      })}
      <View tw="mt-4">
        {paymentMethods.isLoading ? (
          <Skeleton height={16} width={200} />
        ) : defaultPaymentMethod ? (
          <View tw="flex-row items-center">
            <Checkbox
              checked={selectDefault}
              onChange={() => setSelectDefault(!selectDefault)}
              aria-label="Select default payment method"
            />
            <Text
              tw="ml-2 text-gray-900 dark:text-gray-50"
              onPress={() => setSelectDefault(!selectDefault)}
            >
              Use my default payment method.
            </Text>
            <Pressable
              tw="flex-row items-center pl-2"
              onPress={() => setSelectDefault(!selectDefault)}
            >
              <CreditCard
                width={20}
                height={20}
                color={isDark ? colors.white : colors.black}
              />
              <Text tw="ml-1 text-gray-900 dark:text-gray-50">
                Ending in {defaultPaymentMethod.details.last4}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
      <View tw="mb-4 mt-8 items-center p-4">
        <Text tw="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Why is it paid?
        </Text>
        <Text tw="pt-4 text-gray-900 dark:text-gray-50">
          Polygon NFTs cost money to mint, so we made it as affordable as
          possible.
          {`\n\n`}
          This way, your fans don’t need a wallet: you can give away free
          collectibles to people who are new to web3!
        </Text>
      </View>
      <Button
        size="regular"
        onPress={handleSelectPlan}
        disabled={isMutating || paymentStatus === "processing"}
        tw={
          isMutating || paymentStatus === "processing" ? "opacity-[0.45]" : ""
        }
      >
        <Text tw="font-semibold text-gray-50 dark:text-gray-900">
          {isMutating || paymentStatus === "processing"
            ? "Loading..."
            : `Drop ${selectedPlan?.edition_size.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })} editions`}
        </Text>
      </Button>
      {error ? (
        <Text tw="pt-2 text-red-500">{error?.message}. Please retry</Text>
      ) : null}
      {paymentStatus === "failed" || paymentStatus === "notSure" ? (
        <Text tw="pt-2 text-red-500">{paymentStatusMessage}</Text>
      ) : null}
    </View>
  );
};

async function fetchPaymentIntent(
  _url: string,
  { arg }: { arg: { useDefaultPaymentMethod: boolean; dropPlan: DropPlan } }
) {
  if (arg) {
    try {
      const res = await axios({
        method: "POST",
        url: "/v1/payments/start",
        data: {
          payment_plan: arg.dropPlan.name,
          use_default_payment_method: arg.useDefaultPaymentMethod,
        },
      });

      return res;
    } catch (e) {
      const axiosError = e as AxiosError;
      if (axiosError?.response?.data?.error?.code === 400) {
        const res = await axios({
          method: "POST",
          url: "/v1/payments/resume",
        });
        return res;
      } else {
        Logger.error("Payment intent fetch failed ", e);
        throw e;
      }
    }
  }
}

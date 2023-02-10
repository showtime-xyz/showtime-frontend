import * as React from "react";
import { useState, useEffect } from "react";

import useSWRMutation from "swr/mutation";

import { Button } from "@showtime-xyz/universal.button";
import { ErrorText } from "@showtime-xyz/universal.fieldset";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { DropPlan, usePaidDropPlans } from "app/hooks/use-paid-drop-plans";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

export const SelectPlan = ({ setClientSecret }: { setClientSecret: any }) => {
  const paidDropPlansQuery = usePaidDropPlans();
  const [selectedPlan, setSelectedPlan] = useState<DropPlan | null>(null);
  const isDark = useIsDarkMode();
  const { trigger, data, isMutating, error } = useSWRMutation<{
    payment_intent_id: string;
    client_secret: string;
  }>(MY_INFO_ENDPOINT, fetchPaymentIntent);

  useEffect(() => {
    if (data) {
      setClientSecret(data.client_secret);
    }
  }, [data, setClientSecret]);

  useEffect(() => {
    // Sets initial selected plan
    if (paidDropPlansQuery.data && selectedPlan === null) {
      setSelectedPlan(paidDropPlansQuery.data[1]);
    }
  }, [paidDropPlansQuery?.data, selectedPlan]);

  return (
    <View tw="p-4">
      {paidDropPlansQuery.isLoading ? (
        <View>
          <Skeleton
            colorMode={isDark ? "dark" : "light"}
            width="100%"
            height={46}
          />
          <View tw="h-4" />
          <Skeleton
            colorMode={isDark ? "dark" : "light"}
            width="100%"
            height={46}
          />
          <View tw="h-4" />
          <Skeleton
            colorMode={isDark ? "dark" : "light"}
            width="100%"
            height={46}
          />
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
                {plan.edition_size} edition drop
              </Text>
            </View>
            <Text
              tw={`font-space font-semibold ${
                selectedPlan?.name === plan.name ? "" : "dark:text-gray-50"
              } text-gray-900`}
            >
              ${plan.pricing}
            </Text>
          </Pressable>
        );
      })}
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
        onPress={() => trigger(selectedPlan)}
        disabled={isMutating}
      >
        <Text tw="font-semibold text-gray-50 dark:text-gray-900">
          {isMutating ? "Loading..." : "Let's go"}
        </Text>
      </Button>
      {error ? (
        <Text tw="pt-2 text-red-500">{error?.message}. Please retry</Text>
      ) : null}
    </View>
  );
};

async function fetchPaymentIntent(
  _url: string,
  { arg }: { arg: DropPlan | null }
) {
  if (!arg) {
    try {
      const res = await axios({
        method: "POST",
        url: "/v1/payments/start",
        data: {
          payment_plan: arg.name,
        },
      });

      return res;
    } catch (e: any) {
      if (e?.response?.data?.error?.code === 400) {
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

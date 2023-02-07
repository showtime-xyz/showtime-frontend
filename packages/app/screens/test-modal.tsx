import { useState, useEffect } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Checkout } from "app/components/checkout";
import { DropPlan, usePaidDropPlans } from "app/hooks/use-paid-drop-plans";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";

export const CheckoutModal = () => {
  const [paymentIntent, setPaymentIntent] = useState(null);

  return paymentIntent ? (
    <Checkout paymentIntent={paymentIntent} />
  ) : (
    <SelectPlan setPaymentIntent={setPaymentIntent} />
  );
};

const SelectPlan = ({ setPaymentIntent }: { setPaymentIntent: any }) => {
  const paidDropPlansQuery = usePaidDropPlans();
  const [selectedPlan, setSelectedPlan] = useState<DropPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      try {
        const res = await axios({
          method: "POST",
          url: "/v1/payments/start",
          data: {
            payment_plan: selectedPlan?.name,
          },
        });
        setPaymentIntent(res.payment_intent_id);
      } catch (e) {
        // There is an existing payment intent for this user
        if (e?.response?.data?.error.code === 400) {
          const res = await axios({
            method: "POST",
            url: "/v1/payments/resume",
          });

          setPaymentIntent(res.payment_intent_id);
        } else {
          throw e;
        }
      }
    } catch (e) {
      setError(e?.response?.data?.error.message ?? "Something went wrong");
      Logger.error("Payment intent fetch failed ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sets initial selected plan
    if (paidDropPlansQuery.data && selectedPlan === null) {
      setSelectedPlan(paidDropPlansQuery.data[1]);
    }
  }, [paidDropPlansQuery?.data, selectedPlan]);

  return (
    <View tw="p-4">
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
      <Button onPress={onSubmit} disabled={loading}>
        <Text tw="font-semibold text-gray-50 dark:text-gray-900">
          {loading ? "Loading..." : "Let's go"}
        </Text>
      </Button>
      {error ? <Text tw="text-red-500">{error}. Please retry</Text> : null}
    </View>
  );
};

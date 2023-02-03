import { useState } from "react";

import { Button } from "@showtime-xyz/universal.button";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Checkout } from "app/components/checkout";

const plans = [
  {
    name: "50 edition drop",
    price: "$3.99",
  },
  {
    label: "Most Popular",
    name: "100 edition drop",
    price: "$5.99",
  },
  {
    name: "1000 edition drop",
    price: "$9.99",
  },
];

export const CheckoutModal = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(plans[1]);
  const [nextStep, setNextStep] = useState<"plan" | "checkout">("plan");
  return nextStep === "plan" ? (
    <View tw="p-4">
      {plans.map((plan) => {
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
                {plan.name}
              </Text>
            </View>
            <Text
              tw={`font-space font-semibold ${
                selectedPlan?.name === plan.name ? "" : "dark:text-gray-50"
              } text-gray-900`}
            >
              {plan.price}
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
        onPress={() => {
          setNextStep("checkout");
        }}
      >
        Let's go
      </Button>
    </View>
  ) : (
    <Checkout />
  );
};

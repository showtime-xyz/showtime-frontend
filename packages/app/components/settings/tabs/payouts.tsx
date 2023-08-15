import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useOnboardingStatus } from "app/components/payouts/hooks/use-onboarding-status";
import { PayoutDashboard } from "app/components/payouts/payout-dashboard";
import { PayoutSettings } from "app/components/payouts/payout-settings";
import { payoutsRedirectOrigin } from "app/components/payouts/payouts-setup";

import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export const Payouts = ({ index = 0 }: { index: number }) => {
  const onboardinStatus = useOnboardingStatus();
  const router = useRouter();

  if (onboardinStatus.status === "loading") {
    return (
      <View tw="items-center">
        <Spinner />
      </View>
    );
  }

  //onboardinStatus.status = "not_onboarded";

  return (
    <SettingScrollComponent index={index}>
      {onboardinStatus.status === "not_onboarded" ? (
        <SettingsTitle
          title="Payout"
          desc="The following is required in order to take payments. You’ll be redirected to create an account with Stripe who will hold and payout your drop sales."
          descTw="mt-1"
        />
      ) : (
        <SettingsTitle
          title="Payout"
          desc="For each Star Drop sale Showtime takes 10% while Stripe payments processing takes 30¢ + 2.9% per sale."
          descTw="mt-1"
        />
      )}

      <View tw="lg:mt-4 lg:items-start">
        {onboardinStatus.status === "not_onboarded" ? (
          <View tw="items-center p-4 lg:px-0">
            <Button
              tw={"w-full"}
              size="regular"
              onPress={() => {
                if (Platform.OS === "web") {
                  router.push(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        payoutsSetup: true,
                      },
                    },
                    router.asPath,
                    { shallow: true }
                  );
                } else {
                  router.push("/payouts/setup");
                }
              }}
            >
              <View tw="flex-row items-center" style={{ columnGap: 4 }}>
                <Image
                  source={require("app/components/payouts/stripe-logo.png")}
                  height={20}
                  width={20}
                />
                <Text tw="font-semibold text-white dark:text-black">
                  Setup cash payout
                </Text>
              </View>
            </Button>
          </View>
        ) : onboardinStatus.status === "onboarded" ? (
          <View tw="flex w-full lg:w-auto">
            <View
              tw="items-center p-4 text-center lg:flex-row lg:px-0"
              style={{ gap: 10 }}
            >
              <PayoutDashboard />
              <PayoutSettings
                refreshUrl={`${payoutsRedirectOrigin}/settings?tab=${index}&stripeRefresh=true`}
                returnUrl={`${payoutsRedirectOrigin}/settings?tab=${index}&stripeReturn=true`}
              />
            </View>
          </View>
        ) : onboardinStatus.status === "processing" ? (
          <View>
            <PayoutSettings
              refreshUrl={`${payoutsRedirectOrigin}/settings?tab=${index}&stripeRefresh=true`}
              returnUrl={`${payoutsRedirectOrigin}/settings?tab=${index}&stripeReturn=true`}
            />
            <Text tw="pt-4 text-sm text-gray-700 dark:text-gray-300">
              Payout under processing. You will be notified when it is approved.
            </Text>
          </View>
        ) : null}
        <View tw="w-full flex-1 p-4 lg:px-0">
          <View tw="web:md:max-w-[50%] w-[100%] min-w-[320px] self-center rounded-2xl bg-gray-100 p-4 dark:bg-gray-800 sm:max-w-[500px] lg:self-start">
            <Text tw="text-center font-semibold text-gray-600 dark:text-gray-100">
              Example of how much you get paid
            </Text>
            <View
              tw="mt-4 rounded-2xl bg-white p-4 dark:bg-gray-700"
              style={{ rowGap: 16 }}
            >
              <View tw="flex-row justify-between">
                <View>
                  <Text tw="font-semibold text-gray-600 dark:text-gray-300">
                    Star drop sale
                  </Text>
                  <Text tw="text-13 pt-1 text-gray-600 dark:text-gray-300">
                    (1 Collector purchase)
                  </Text>
                </View>
                <Text tw="text-gray-600 dark:text-gray-300">$3.00</Text>
              </View>

              <View tw="flex-row justify-between">
                <View>
                  <Text tw="font-semibold text-gray-600 dark:text-gray-300">
                    Stripe payment fee
                  </Text>
                  <Text tw="text-13 pt-1 text-gray-600 dark:text-gray-300">
                    (30¢ + 2.9%)
                  </Text>
                </View>
                <Text tw="text-gray-600 dark:text-gray-300">-$0.39</Text>
              </View>

              <View tw="flex-row justify-between">
                <View>
                  <Text tw="font-semibold text-gray-600 dark:text-gray-300">
                    Showtime fee
                  </Text>
                  <Text tw="text-13 pt-1 text-gray-600 dark:text-gray-300">
                    (10%)
                  </Text>
                </View>
                <Text tw="text-gray-600 dark:text-gray-300">-$0.30</Text>
              </View>

              <View>
                <View
                  tw="mt-1 h-1 border-gray-300 dark:border-gray-100"
                  style={{
                    borderTopWidth: 1,
                    borderStyle: Platform.select({
                      web: "dashed",
                      default: "solid",
                    }),
                  }}
                />
                <View tw="mt-2 flex-row justify-between">
                  <Text tw="font-bold text-gray-800 dark:text-gray-100">
                    Total revenue
                  </Text>
                  <Text tw="font-bold text-gray-800 dark:text-gray-100">
                    $2.31
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SettingScrollComponent>
  );
};

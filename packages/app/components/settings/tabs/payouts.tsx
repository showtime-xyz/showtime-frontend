import { Platform, Linking } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { LinkOut } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useOnboardingStatus } from "app/components/payouts/hooks/use-onboarding-status";
import { useStripeAccountLink } from "app/components/payouts/hooks/use-stripe-account-link";

import { SettingsTitle } from "../settings-title";

const websiteUrl = `${
  __DEV__
    ? "http://localhost:3000"
    : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
}`;

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
  return (
    <SettingScrollComponent index={index}>
      {onboardinStatus.status === "not_onboarded" ? (
        <SettingsTitle
          title="Payout"
          desc="The following is required in order to take payments. You’ll be redirected to create an account with Stripe who will hold and payout your drop sales."
          descTw="mt-1"
        />
      ) : null}
      <View tw="p-4 lg:px-0">
        {onboardinStatus.status === "not_onboarded" ? (
          <Button
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
                Setup cast payout
              </Text>
            </View>
          </Button>
        ) : onboardinStatus.status === "onboarded" ? (
          <View>
            <PayoutSettings
              refreshUrl={`${websiteUrl}/settings?tab=${index}&stripeRefresh=true`}
              returnUrl={`${websiteUrl}/settings?tab=${index}&stripeReturn=true`}
            />
            <Text tw="pt-4 text-sm text-gray-700 dark:text-gray-300">
              For each Star Drop sale Showtime takes 10% while Stripe payments
              processing takes 30¢ + 2.9% per sale.
            </Text>
          </View>
        ) : onboardinStatus.status === "processing" ? (
          <View>
            <PayoutSettings
              refreshUrl={`${websiteUrl}/settings?tab=${index}&stripeRefresh=true`}
              returnUrl={`${websiteUrl}/settings?tab=${index}&stripeReturn=true`}
            />
            <Text tw="pt-4 text-sm text-gray-700 dark:text-gray-300">
              Payout under processing. You will be notified when it is approved.
            </Text>
          </View>
        ) : null}
        <View tw="mt-4 max-w-[320px] rounded-2xl bg-gray-100 p-4  dark:bg-gray-800">
          <Text tw="text-gray-900 dark:text-gray-100">
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
                style={{ borderTopWidth: 1, borderStyle: "dashed" }}
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
    </SettingScrollComponent>
  );
};

export const PayoutSettings = ({
  refreshUrl,
  returnUrl,
}: {
  returnUrl: string;
  refreshUrl: string;
}) => {
  const stripeAccountLink = useStripeAccountLink();

  return (
    <Pressable
      onPress={async () => {
        const value = await stripeAccountLink.trigger({
          refresh_url: refreshUrl,
          return_url: returnUrl,
        });
        if (Platform.OS === "web") {
          window.location.href = value.url;
        } else {
          Linking.openURL(value.url);
        }
      }}
    >
      <View tw="flex-row items-center" style={{ columnGap: 4 }}>
        <Image
          source={require("app/components/payouts/stripe-logo.png")}
          height={20}
          width={20}
        />
        <Text tw="font-semibold text-[#6672e4]">View payout settings</Text>
        <LinkOut height={16} width={16} color="#6672e4" />
      </View>
    </Pressable>
  );
};

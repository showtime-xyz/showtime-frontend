import { Platform, Linking } from "react-native";

import { LinkOut } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useStripeAccountLink } from "app/components/payouts/hooks/use-stripe-account-link";

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
      tw="w-full items-center rounded-full p-4 px-6 text-center"
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
        <Text tw="font-semibold text-[#6672e4]">Payout settings</Text>
        <LinkOut height={12} width={12} color="#6672e4" />
      </View>
    </Pressable>
  );
};

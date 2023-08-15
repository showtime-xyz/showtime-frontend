import { Platform, Linking } from "react-native";

import { LinkOut } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

const DASHBOARD_LINK = "https://connect.stripe.com/express_login";
export const PayoutDashboard = () => {
  return (
    <Pressable
      tw="w-full items-center rounded-full bg-gray-800 p-4 px-6 text-center"
      onPress={async () => {
        if (Platform.OS === "web") {
          window.location.href = DASHBOARD_LINK;
        } else {
          Linking.openURL(DASHBOARD_LINK);
        }
      }}
    >
      <View tw="flex-row items-center" style={{ columnGap: 4 }}>
        <Image
          source={require("app/components/payouts/stripe-logo.png")}
          height={16}
          width={16}
        />
        <Text tw="font-semibold text-white">View balance</Text>
        <LinkOut height={12} width={12} color="white" />
      </View>
    </Pressable>
  );
};

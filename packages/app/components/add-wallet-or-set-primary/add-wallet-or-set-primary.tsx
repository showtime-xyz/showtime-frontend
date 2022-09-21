import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const AddWalletOrSetPrimary = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const router = useRouter();
  return (
    <View tw="items-center p-2">
      <View tw="h-8" />
      <Text tw="text-center text-xl text-black dark:text-white">{title} </Text>
      <View tw="mt-8 mb-10">
        <Text tw="text-center text-base text-black dark:text-white">
          {description}
        </Text>
      </View>
      <Button
        onPress={() => {
          // Close the native modal
          if (Platform.OS !== "web") {
            router.pop();
          }

          router.push("/settings?redirectTo=" + router.pathname);
        }}
        size="regular"
      >
        Select Primary Wallet
      </Button>
    </View>
  );
};

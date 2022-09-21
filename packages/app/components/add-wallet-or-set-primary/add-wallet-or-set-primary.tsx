import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { setPrimaryWalletSuccessCallback } from "app/hooks/api/use-set-primary-wallet";

export const AddWalletOrSetPrimary = ({
  title,
  description,
  onPrimaryWalletSetCallback,
}: {
  title: string;
  description: string;
  onPrimaryWalletSetCallback?: Function;
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
          // Close modal on native
          if (Platform.OS !== "web") {
            router.pop();
          }
          setPrimaryWalletSuccessCallback(onPrimaryWalletSetCallback);
          router.push("/settings");
        }}
        size="regular"
      >
        Select Primary Wallet
      </Button>
    </View>
  );
};

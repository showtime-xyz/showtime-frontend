import { Platform } from "react-native";

import { setPrimaryWalletSuccessCallback } from "app/hooks/api/use-set-primary-wallet";

import { Button } from "design-system/button";
import { useRouter } from "design-system/router";
import { Text } from "design-system/text";
import { View } from "design-system/view";

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

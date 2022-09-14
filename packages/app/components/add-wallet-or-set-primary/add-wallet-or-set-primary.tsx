import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { TextLink } from "app/navigation/link";

export const AddWalletOrSetPrimary = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <View tw="items-center py-2">
      <View tw="h-8" />
      <Text tw="text-center text-xl text-black dark:text-white">{title} </Text>
      <View tw="mt-8 mb-10">
        <Text tw="text-center text-base text-black dark:text-white">
          {description}
        </Text>
      </View>
      <TextLink
        href="/settings"
        tw="rounded-3xl bg-gray-900 py-3 px-4 text-sm font-bold text-white dark:bg-gray-200 dark:text-black"
      >
        Select Primary Wallet
      </TextLink>
    </View>
  );
};

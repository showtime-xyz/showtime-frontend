import * as React from "react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { TextLink } from "app/navigation/link";

export const AddWalletOrSetPrimary = () => {
  return (
    <View tw="items-center">
      <View tw="h-8" />
      <Text tw="text-center text-xl text-black dark:text-white">
        Choose a primary wallet to receive your drop
      </Text>
      <View tw="mt-8 mb-10">
        <Text tw="text-center text-base text-black dark:text-white">
          Please choose which wallet will receive your drop. You only have to do
          this once!
        </Text>
      </View>
      <TextLink
        href="/settings"
        tw="rounded-3xl bg-gray-900 p-4 text-white dark:bg-gray-200 dark:text-black"
      >
        Select Primary wallet
      </TextLink>
    </View>
  );
};

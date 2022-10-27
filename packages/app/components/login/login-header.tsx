import { Linking } from "react-native";

import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export function LoginHeader() {
  return (
    <View>
      <Text tw="text-center font-semibold text-gray-900 dark:text-white">
        Sign in to create and collect free drops from your favorite creators. If
        this is your first time, you will create a new profile.
      </Text>
      <View tw="h-[10px]" />
      <View tw="mb-[16px] flex-row justify-center">
        <Text tw="text-center text-xs text-gray-600 dark:text-gray-400">
          By signing in you agree to our{" "}
        </Text>
        <PressableScale
          onPress={() => {
            Linking.openURL(
              "https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
            );
          }}
        >
          <Text tw="text-center text-xs font-bold text-black dark:text-white">
            Terms &amp; Conditions
          </Text>
        </PressableScale>
        <Text tw="text-center text-xs text-gray-600 dark:text-gray-400">.</Text>
      </View>
    </View>
  );
}

import React from "react";
import { Linking } from "react-native";

import { View, Text, PressableScale } from "design-system";

export function LoginHeader() {
  return (
    <>
      <Text tw="mb-[10px] text-center font-semibold text-gray-900 dark:text-white">
        If this is your first time, it will create a new account on Showtime.
      </Text>
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
    </>
  );
}

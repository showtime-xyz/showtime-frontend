import React from "react";
import { Linking } from "react-native";
import { View, Text, Pressable } from "design-system";

export function LoginHeader() {
  return (
    <>
      <Text tw="text-gray-900 dark:text-white mb-[10px] text-center font-semibold">
        If this is your first time, it will create a new account on Showtime.
      </Text>
      <View tw="flex-row justify-center mb-[16px]">
        <Text
          variant="text-xs"
          tw="text-gray-600 dark:text-gray-400 text-center"
        >
          By signing in you agree to our{" "}
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL(
              "https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68"
            );
          }}
        >
          <Text
            variant="text-xs"
            tw="text-black dark:text-white font-bold text-center"
          >
            Terms &amp; Conditions
          </Text>
        </Pressable>
        <Text
          variant="text-xs"
          tw="text-gray-600 dark:text-gray-400 text-center"
        >
          .
        </Text>
      </View>
    </>
  );
}

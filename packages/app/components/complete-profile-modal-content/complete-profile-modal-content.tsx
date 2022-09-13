import * as React from "react";
import { Platform } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const CompleteProfileModalContent = ({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: string;
}) => {
  const router = useRouter();
  return (
    <View tw="flex-1 items-center justify-center px-10 text-center">
      <Text tw="pb-4 text-2xl text-gray-900 dark:text-gray-100">{title}</Text>
      <Image
        source={Platform.select({
          web: { uri: require("./complete-profile.png") },
          default: require("./complete-profile.png"),
        })}
        tw="rounded-xl"
        width={100}
        height={100}
        resizeMode="contain"
      />
      <Text tw="py-4 text-center text-base text-gray-900 dark:text-gray-100">
        {description}
      </Text>
      <Button tw="my-4" onPress={() => router.push("/profile/edit")}>
        {cta}
      </Button>
    </View>
  );
};

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Skeleton } from "./index";

export default {
  component: Skeleton,
  title: "Components/Skeleton",
};

export const SkeletonBasic = () => {
  return (
    <View tw="flex-1 items-center justify-center">
      <Text tw="text-2xl">Dark</Text>
      <View tw="h-2" />
      <Skeleton width={220} height={220} colorMode="dark" />
      <View tw="h-8" />
      <Text tw="text-2xl">Light</Text>
      <View tw="h-2" />
      <Skeleton width={220} height={220} colorMode="light" />
    </View>
  );
};

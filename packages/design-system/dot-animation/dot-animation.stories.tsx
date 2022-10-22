import { Meta } from "@storybook/react";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { DotAnimation } from ".";

export default {
  component: DotAnimation,
  title: "Components/DotAnimation",
} as Meta;

export const Basic: React.VFC<{}> = () => (
  <View tw="flex-1 items-center justify-center">
    <Text tw="text-lg text-white dark:text-white">
      Claiming in progress
      <DotAnimation color="#000" />
    </Text>
  </View>
);

import { Meta } from "@storybook/react";

import { Divider } from ".";
import { Text } from "../text";
import { View } from "../view";

export default {
  component: Divider,
  title: "Components/Divider",
} as Meta;

export const Basic: React.VFC<{}> = () => (
  <View tw="flex-1 items-center justify-center">
    <Divider tw="my-4" />
    <Divider tw="my-4" width={300} />
    <Divider tw="my-4" height={10} width={100} />
    <View tw="flex-row items-center">
      <Text tw="text-black dark:text-white">A</Text>
      <Divider tw="my-4 mx-1" height={10} orientation="vertical" />
      <Text tw="text-black dark:text-white">T</Text>
    </View>
  </View>
);

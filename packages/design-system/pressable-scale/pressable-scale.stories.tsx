import { Meta } from "@storybook/react";

import { Pressable } from "./index";
import { Text } from "../text";

export default {
  component: Pressable,
  title: "Components/PressableScale",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <Pressable tw="bg-black dark:bg-white p-2 rounded-full w-auto">
    <Text tw="text-white dark:text-black text-center">Press Me</Text>
  </Pressable>
);

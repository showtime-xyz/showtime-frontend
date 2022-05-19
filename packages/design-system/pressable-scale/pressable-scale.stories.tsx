import { Meta } from "@storybook/react";

import { Text } from "../text";
import { PressableScale } from "./index";

export default {
  component: PressableScale,
  title: "Components/PressableScale",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <PressableScale tw="w-auto rounded-full bg-black p-2 dark:bg-white">
    <Text tw="text-center text-white dark:text-black">Press Me</Text>
  </PressableScale>
);

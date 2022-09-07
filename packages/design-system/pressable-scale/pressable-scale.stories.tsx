import { Meta } from "@storybook/react";

import { Text } from "@showtime-xyz/universal.text";

import { PressableScale } from "./index";

export default {
  component: PressableScale,
  title: "Components/PressableScale",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <PressableScale
    style={{
      padding: 8,
      width: "auto",
      borderRadius: 9999,
      backgroundColor: "blue",
    }}
  >
    <Text tw="text-center text-white dark:text-black">Press Me</Text>
  </PressableScale>
);

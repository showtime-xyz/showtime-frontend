import { Text } from "@showtime-xyz/universal.text";

import { PressableHover } from "./index";

export default {
  component: PressableHover,
  title: "Components/PressableHover",
};

export const Primary = () => (
  <PressableHover tw="w-auto rounded-full bg-black p-2 dark:bg-white">
    <Text tw="text-center text-white dark:text-black">Press Me</Text>
  </PressableHover>
);

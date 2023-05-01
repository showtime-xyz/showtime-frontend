import { Text } from "@showtime-xyz/universal.text";

import { Pressable } from "./index";

export default {
  component: Pressable,
  title: "Components/Pressable",
};

export const Primary = () => (
  <Pressable tw="w-auto rounded-full bg-black p-2 dark:bg-white">
    <Text tw="text-center text-white dark:text-black">Press Me</Text>
  </Pressable>
);

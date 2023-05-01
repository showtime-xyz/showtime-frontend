import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Divider } from ".";

export default {
  component: Divider,
  title: "Components/Divider",
};

export const Basic = () => (
  <View tw="flex-1 items-center justify-center">
    <Divider tw="my-4" />
    <Divider tw="my-4" width={300} />
    <Divider tw="my-4" height={10} width={100} />
    <View tw="flex-row items-center">
      <Text tw="text-black dark:text-white">A</Text>
      <Divider tw="mx-1 my-4" height={10} orientation="vertical" />
      <Text tw="text-black dark:text-white">T</Text>
    </View>
  </View>
);

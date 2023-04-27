import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ThreeDotsAnimation } from ".";

export default {
  component: ThreeDotsAnimation,
  title: "Components/ThreeDotsAnimation",
};

export const Basic = () => (
  <View tw="flex-1 items-center justify-center">
    <Text tw="text-lg text-white dark:text-white">
      Collecting
      <ThreeDotsAnimation color="#000" />
    </Text>
  </View>
);

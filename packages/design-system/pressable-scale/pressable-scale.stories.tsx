import { Text } from "@showtime-xyz/universal.text";

import { PressableScale } from "./index";

export default {
  component: PressableScale,
  title: "Components/PressableScale",
};

export const Primary = () => (
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

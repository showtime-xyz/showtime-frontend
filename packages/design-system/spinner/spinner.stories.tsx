import { View } from "@showtime-xyz/universal.view";

import { Spinner } from "./index";

export default {
  component: Spinner,
  title: "Components/Spinner",
};

export const Basic = () => (
  <View tw="flex-1 items-center justify-center">
    <Spinner />
  </View>
);

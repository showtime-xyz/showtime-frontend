import { Meta } from "@storybook/react";

import { DataPill } from "./index";
import { View } from "@showtime/universal-ui.view";

export default {
  component: DataPill,
  title: "Components/DataPill",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <View tw="dark:bg-gray-300 flex-row flex-1 items-center justify-center">
    <DataPill label="Label" />
    <View tw="w-4"></View>
    <DataPill type="secondary" label="Label" />
  </View>
);

import { Meta } from "@storybook/react";

import { View } from "@showtime-xyz/universal.view";

import { DataPill } from "./index";

export default {
  component: DataPill,
  title: "Components/DataPill",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <View tw="flex-1 flex-row items-center justify-center dark:bg-gray-300">
    <DataPill label="Label" />
    <View tw="w-4"></View>
    <DataPill type="secondary" label="Label" />
  </View>
);

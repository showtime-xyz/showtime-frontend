import { View } from "react-native";

import { Meta } from "@storybook/react";

import { Chip } from "./index";

export default {
  component: Chip,
  title: "Components/Chip",
} as Meta;

export const Basic: React.VFC<{}> = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Chip label="Follows You" />
  </View>
);

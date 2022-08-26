import React from "react";
import { View } from "react-native";

import { Meta } from "@storybook/react";

import { ClampText } from "./clamp-text";

export default {
  component: ClampText,
  title: "Components/ClampText",
} as Meta;

export const Basic: React.VFC<{}> = () => {
  return (
    <View style={{ width: 200 }}>
      <ClampText
        tw="text-sm text-gray-600 dark:text-gray-400"
        maxLines={2}
        text={
          "A very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
        }
      />
    </View>
  );
};

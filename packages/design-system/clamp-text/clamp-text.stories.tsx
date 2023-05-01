import React from "react";

import { View } from "@showtime-xyz/universal.view";

import { ClampText } from "./index";

export default {
  component: View,
  title: "Components/ClampText",
};

export const Basic = () => {
  return (
    <View tw="flex-1 items-center justify-center">
      <View style={{ width: 200, overflow: "hidden" }}>
        <ClampText
          maxLines={2}
          text="A very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text"
        />
      </View>
    </View>
  );
};

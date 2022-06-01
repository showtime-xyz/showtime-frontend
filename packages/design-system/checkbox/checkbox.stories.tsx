import React from "react";

import { Meta } from "@storybook/react";

import { Checkbox } from "@showtime-xyz/universal.checkbox";
import { Label } from "@showtime-xyz/universal.label";
import { View } from "@showtime-xyz/universal.view";

export default {
  component: Checkbox,
  title: "Components/Checkbox",
} as Meta;

export const Primary: React.VFC<{}> = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <View tw="flex-row items-center">
      <Checkbox
        id="checkbox"
        accesibilityLabel="I agree"
        checked={checked}
        onChange={setChecked}
      />
      <Label
        htmlFor="checkbox"
        tw="ml-2 flex-row items-center text-black dark:text-white"
      >
        I agree
      </Label>
    </View>
  );
};

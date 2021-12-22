import React from "react";
import { Meta } from "@storybook/react";

import { Checkbox } from "../checkbox";
import { View } from "../view";
import { Label } from "../label";

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
        tw="flex-row ml-2 items-center text-black dark:text-white"
      >
        I agree
      </Label>
    </View>
  );
};

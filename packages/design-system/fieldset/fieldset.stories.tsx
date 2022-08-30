import { useState } from "react";

import { Meta } from "@storybook/react";

import { View } from "@showtime-xyz/universal.view";

import { Fieldset } from "./index";

export default {
  component: Fieldset,
  title: "Components/Fieldset",
} as Meta;

const options = [
  {
    value: 0,
    label: "Option A",
  },
  {
    value: 1,
    label: "Option BBBBBB",
  },
  {
    value: 2,
    label: "Option C",
  },
];
export const Primary: React.VFC<{}> = () => {
  const [value, setValue] = useState(0);
  return (
    <View tw="flex-1 dark:bg-gray-300">
      <Fieldset
        errorText="hello world"
        helperText="hello world"
        placeholder="placeholder"
      />
      <Fieldset
        label="Default NFT List"
        tw="mt-4"
        selectOnly
        select={{
          options: options,
          placeholder: "Select",
          value: value,
          onChange: (e) => setValue(+e),
        }}
      />
    </View>
  );
};

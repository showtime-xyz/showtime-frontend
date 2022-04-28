import { Meta } from "@storybook/react";

import { View } from "../view";
import { Fieldset } from "./index";

export default {
  component: Fieldset,
  title: "Components/Fieldset",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <View tw="flex-1 flex-row items-center justify-center dark:bg-gray-300">
    <Fieldset
      errorText="hello world"
      helperText="hello world"
      placeholder="placeholder"
    />
  </View>
);

import { Meta } from "@storybook/react";

import { Fieldset } from "./index";
import { View } from "../view";

export default {
  component: Fieldset,
  title: "Components/Fieldset",
} as Meta;

export const Primary: React.VFC<{}> = () => (
  <View tw="dark:bg-gray-300 flex-row flex-1 items-center justify-center">
    <Fieldset
      errorText="hello world"
      helperText="hello world"
      placeholder="placeholder"
    />
  </View>
);

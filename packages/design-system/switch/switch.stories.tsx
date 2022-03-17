import { useState } from "react";

import { Meta } from "@storybook/react";

import { Switch } from "./index";

export default {
  component: Switch,
  title: "Components/Switch",
} as Meta;

export const Basic: React.VFC<{}> = () => {
  const [selected, setSelected] = useState(false);
  return <Switch checked={selected} onChange={setSelected} />;
};

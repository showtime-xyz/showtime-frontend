import { useState } from "react";

import { Meta } from "@storybook/react";

import { SegmentedControl } from "./index";

export default {
  component: SegmentedControl,
  title: "Components/SegmentedControl",
} as Meta;

export const Primary: React.VFC<{}> = () => {
  const [selected, setSelected] = useState(0);
  return (
    <SegmentedControl
      values={["LABEL 1", "LABEL 2", "LABEL 3"]}
      onChange={setSelected}
      selectedIndex={selected}
    />
  );
};

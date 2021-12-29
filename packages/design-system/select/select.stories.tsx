import React, { useState } from "react";
import { View } from "../view";
import { Select } from "./index";

const options = [
  {
    value: 0,
    label: "Option A",
  },
  {
    value: 1,
    label: "Option B",
  },
  {
    value: 2,
    label: "Option C",
  },
];

const Container = (props: any) => {
  return (
    <View
      tw={"items-center p-10"}
      style={{ flex: 1 }}
    >
      {props.children}
    </View>
  );
};

export const Basic: React.FC<{}> = () => {
  const [value, setValue] = useState(1);
  return (
    <Container>
      <Select
        value={value}
        label={options[value].label}
        options={options}
        onChange={setValue}
      />
      <View tw="m-2" />
      <Select
        value={value}
        label={options[value].label}
        size="small"
        options={options}
        onChange={setValue}
      />
    </Container>
  );
};

export default {
  component: Basic,
  title: "Components/Select",
};

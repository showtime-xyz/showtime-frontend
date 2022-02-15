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
    <View tw={"items-center p-10"} style={{ flex: 1 }}>
      {props.children}
    </View>
  );
};

export const Regular: React.FC = () => {
  const [value, setValue] = useState(-1);
  return (
    <Container>
      <Select
        value={value}
        options={options}
        tw="min-w-min"
        onChange={setValue}
      />
    </Container>
  );
};

export const Small: React.FC = () => {
  const [value, setValue] = useState(-1);
  return (
    <Container>
      <Select
        value={value}
        options={options}
        size="small"
        onChange={setValue}
      />
    </Container>
  );
};

export const Disabled: React.FC = () => {
  const [value, setValue] = useState(-1);
  return (
    <Container>
      <Select value={value} disabled options={options} onChange={setValue} />
    </Container>
  );
};

export default {
  component: Regular,
  title: "Components/Select",
};

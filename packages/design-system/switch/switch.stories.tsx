import { useState } from "react";

import { Switch } from "./index";

export default {
  component: Switch,
  title: "Components/Switch",
};

export const Basic = () => {
  const [selected, setSelected] = useState(false);
  return <Switch checked={selected} onChange={setSelected} />;
};

import { Meta } from "@storybook/react";

import { Spinner } from "./index";
import { View } from "../view";

export default {
  component: Spinner,
  title: "Components/Spinner",
} as Meta;

export const Basic: React.VFC<{}> = () => <Spinner />;

import { Meta } from "@storybook/react";

import { MessageBox } from "./message-box";

export default {
  component: MessageBox,
  title: "Components/Messages/MessageBox",
} as Meta;

export const Basic: React.VFC<{}> = () => <MessageBox />;

import { Meta } from "@storybook/react";

import { VerificationBadge } from "./index";

export default {
  component: VerificationBadge,
  title: "Components/VerificationBadge",
} as Meta;

export const Basic: React.VFC<{}> = () => {
  return <VerificationBadge />;
};

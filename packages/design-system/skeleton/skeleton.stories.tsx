import { Meta } from "@storybook/react";

import { Skeleton } from "./index";

export default {
  component: Skeleton,
  title: "Components/Skeleton",
} as Meta;

export const SkeletonBlack: React.VFC<{}> = () => <Skeleton />;

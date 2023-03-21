import React from "react";

import { View } from "design-system/view";

export type BlurViewProps = {
  tw?: string;
  children?: JSX.Element;
};
export const BlurView = ({ children, ...rest }: BlurViewProps) => {
  return <View {...rest}>{children}</View>;
};

import React from "react";

import { View } from "@showtime-xyz/universal.view";

export type BlurViewProps = {
  tw?: string;
  children?: JSX.Element;
};
export const BlurView = ({ children, ...rest }: BlurViewProps) => {
  return <View {...rest}>{children}</View>;
};

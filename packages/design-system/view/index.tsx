import { forwardRef, createElement, useMemo } from "react";
import { ViewProps as RNViewProps } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";
import type { TW } from "@showtime-xyz/universal.tailwind";

export type ViewProps = Omit<RNViewProps, "tw"> & {
  tw?: string | Array<string> | TW[];
};

const RCTView = forwardRef((props, ref) => {
  return createElement("RCTView", { ...props, ref });
});

RCTView.displayName = "RCTView";

const StyledView = styled(RCTView);

const View = forwardRef(function View({ tw, ...props }: ViewProps, ref: any) {
  const twClass = useMemo(() => (Array.isArray(tw) ? tw.join(" ") : tw), [tw]);
  return <StyledView {...props} tw={twClass} ref={ref} />;
});

View.displayName = "View";

export { View };

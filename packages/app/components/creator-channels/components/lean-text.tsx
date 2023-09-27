import { forwardRef, createElement, ComponentType } from "react";
import { TextProps } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";

const Component = forwardRef((props, ref) => {
  return createElement("RCTText", { ...props, ref });
}) as ComponentType<TextProps>;

Component.displayName = "RCTText";

export const LeanText = styled(Component);

/*
export const LeanText = ({ tw, ...rest }) => {
  const style = useMemo(() => (Array.isArray(tw) ? tw.join(" ") : tw), [tw]);

  return <BasicText tw={style} {...rest} />;
};
*/

import { forwardRef, createElement, ComponentType } from "react";
import { TextProps, ViewProps } from "react-native";

import { styled } from "@showtime-xyz/universal.tailwind";

const Component = forwardRef((props, ref) => {
  return createElement("RCTText", { ...props, ref });
}) as ComponentType<TextProps>;

Component.displayName = "RCTText";

export const LeanText = styled(Component);

const ComponentView = forwardRef((props, ref) => {
  return createElement("RCTView", { ...props, ref });
}) as ComponentType<ViewProps>;

ComponentView.displayName = "RCTView";

export const LeanView = styled(ComponentView);

/*
export const LeanText = ({ tw, ...rest }) => {
  const style = useMemo(() => (Array.isArray(tw) ? tw.join(" ") : tw), [tw]);

  return <BasicText tw={style} {...rest} />;
};
*/

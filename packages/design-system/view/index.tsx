import { ComponentProps, forwardRef } from "react";
import { View as ReactNativeView } from "react-native";

import { styled } from "tailwindcss-react-native";

import type { TW } from "design-system/tailwind/types";

const StyledView = styled(ReactNativeView);

export type ViewProps = { tw?: TW } & ComponentProps<typeof ReactNativeView>;

const View = forwardRef(function View({ tw, ...props }: ViewProps, ref: any) {
  return (
    <StyledView
      tw={Array.isArray(tw) ? tw.join(" ") : tw}
      {...props}
      ref={ref}
    />
  );
});

View.displayName = "View";

export { View };

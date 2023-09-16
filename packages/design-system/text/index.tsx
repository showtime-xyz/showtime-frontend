import { ComponentProps, forwardRef } from "react";
import { Text as TextType } from "react-native";

import type { TW } from "@showtime-xyz/universal.tailwind";
import { ViewProps } from "@showtime-xyz/universal.view";

import { Text as StyledText } from "./text";

export type TextProps = ComponentProps<typeof StyledText>;

export type Props = {
  tw?: TW;
  htmlFor?: string;
  pointerEvents?: ViewProps["pointerEvents"];
} & Pick<
  TextProps,
  | "onPress"
  | "onLayout"
  | "onTextLayout"
  | "children"
  | "selectable"
  | "id"
  | "role"
  | "numberOfLines"
  | "ellipsizeMode"
  | "style"
>;

/**
 * Note: You can wrap <Text> in a <View> with a background color
 * to verify if the text is rendered correctly and if Capsize is working well.
 */
export const Text = forwardRef<TextType, Props>(
  (
    {
      onPress,
      onLayout,
      onTextLayout,
      children,
      selectable,
      tw = "",
      id,
      htmlFor,
      role,
      numberOfLines,
      ellipsizeMode,
      pointerEvents,
      ...props
    },
    ref
  ) => {
    return (
      <StyledText
        tw={Array.isArray(tw) ? tw.join(" ") : tw}
        id={id}
        ref={ref}
        onPress={onPress}
        selectable={selectable}
        onLayout={onLayout}
        onTextLayout={onTextLayout}
        role={role}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        // @ts-ignore - this prop will only work on web. Refer text.web.tsx
        htmlFor={htmlFor}
        pointerEvents={pointerEvents}
        {...props}
      >
        {children}
      </StyledText>
    );
  }
);

Text.displayName = "Text";

export { linkify } from "./linkify";

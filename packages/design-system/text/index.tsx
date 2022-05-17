import { ComponentProps, createContext, forwardRef, useContext } from "react";
import type { Text as TextType } from "react-native";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { textSizes } from "design-system/typography";

import { ViewProps } from "../view";
import { Text as UniversalText } from "./text";

export type TextProps = ComponentProps<typeof UniversalText>;

export type Props = {
  tw?: TW;
  variant?: keyof typeof textSizes;
  htmlFor?: string;
  pointerEvents?: ViewProps["pointerEvents"];
} & Pick<
  TextProps,
  | "onLayout"
  | "onTextLayout"
  | "children"
  | "selectable"
  | "nativeID"
  | "accessibilityRole"
  | "numberOfLines"
  | "ellipsizeMode"
  | "onPress"
  | "style"
>;

/**
 * Text should inherit styles from parent text nodes.
 */
const ParentContext = createContext<{} | undefined>(undefined);

/**
 * Note: You can wrap <Text> in a <View> with a background color
 * to verify if the text is rendered correctly and if Capsize is working well.
 */
export const Text = forwardRef<TextType, Props>(
  (
    {
      // variant,
      onLayout,
      onTextLayout,
      children,
      selectable,
      tw,
      nativeID,
      htmlFor,
      accessibilityRole,
      numberOfLines,
      ellipsizeMode,
      pointerEvents,
      onPress,
      style,
    },
    ref
  ) => {
    const parentTw = useContext(ParentContext);

    const compoundStyle = {
      ...(style as object),
      ...tailwind.style(parentTw),
      ...tailwind.style(tw),
    };

    // TODO: implement `variant`

    return (
      <UniversalText
        style={compoundStyle}
        nativeID={nativeID}
        ref={ref}
        selectable={selectable}
        onLayout={onLayout}
        onTextLayout={onTextLayout}
        accessibilityRole={accessibilityRole}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
        // @ts-ignore - this prop will only work on web. Refer text.web.tsx
        htmlFor={htmlFor}
        pointerEvents={pointerEvents}
      >
        <ParentContext.Provider value={compoundStyle}>
          {children}
        </ParentContext.Provider>
      </UniversalText>
    );
  }
);

Text.displayName = "Text";

export { linkify } from "./linkify";

import { ComponentProps, createContext, forwardRef, useContext } from "react";
import type { Text as TextType } from "react-native";

import { Theme } from "dripsy";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";

import { ViewProps } from "../view";
import { Text as DripsyText } from "./text";

type Variant = keyof Theme["text"];

export type TextProps = ComponentProps<typeof DripsyText>;

export type Props = {
  tw?: TW;
  variant?: Variant;
  htmlFor?: string;
  pointerEvents?: ViewProps["pointerEvents"];
} & Pick<
  TextProps,
  | "onLayout"
  | "onTextLayout"
  | "children"
  | "selectable"
  | "sx"
  | "nativeID"
  | "accessibilityRole"
  | "numberOfLines"
  | "ellipsizeMode"
  | "onPress"
>;

/**
 * Text should inherit styles from parent text nodes.
 */
const ParentContext = createContext<{} | undefined>(undefined);

/**
 * Note: You can wrap <DripsyText> in a <View> with a background color
 * to verify if the text is rendered correctly and if Capsize is working well.
 */
export const Text = forwardRef<TextType, Props>(
  (
    {
      variant,
      onLayout,
      onTextLayout,
      children,
      selectable,
      tw,
      sx,
      nativeID,
      htmlFor,
      accessibilityRole,
      numberOfLines,
      ellipsizeMode,
      pointerEvents,
      onPress,
    },
    ref
  ) => {
    const parentTw = useContext(ParentContext);

    const compoundSx = {
      ...tailwind.style(parentTw),
      ...sx,
      ...tailwind.style(tw),
    };

    return (
      <DripsyText
        nativeID={nativeID}
        ref={ref}
        variant={variant}
        selectable={selectable}
        onLayout={onLayout}
        onTextLayout={onTextLayout}
        sx={compoundSx}
        accessibilityRole={accessibilityRole}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        onPress={onPress}
        // @ts-ignore - this prop will only work on web. Refer text.web.tsx
        htmlFor={htmlFor}
        pointerEvents={pointerEvents}
      >
        <ParentContext.Provider value={compoundSx}>
          {children}
        </ParentContext.Provider>
      </DripsyText>
    );
  }
);

Text.displayName = "Text";

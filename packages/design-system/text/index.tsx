import { Text as DripsyText } from "./text";
import { Theme } from "dripsy";
import { ComponentProps, createContext, forwardRef, useContext } from "react";
import type { Text as TextType } from "react-native";

import { tw as tailwind } from "@showtime/universal-ui.tailwind";
import type { TW } from "@showtime/universal-ui.tailwind";

type Variant = keyof Theme["text"];

type TextProps = ComponentProps<typeof DripsyText>;

export type Props = {
  tw?: TW;
  variant?: Variant;
  htmlFor?: string;
} & Pick<
  TextProps,
  | "onLayout"
  | "children"
  | "selectable"
  | "sx"
  | "nativeID"
  | "accessibilityRole"
  | "numberOfLines"
  | "ellipsizeMode"
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
      children,
      selectable,
      tw,
      sx,
      nativeID,
      htmlFor,
      accessibilityRole,
      numberOfLines,
      ellipsizeMode,
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
        sx={compoundSx}
        accessibilityRole={accessibilityRole}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        // @ts-ignore - this prop will only work on web. Refer text.web.tsx
        htmlFor={htmlFor}
      >
        <ParentContext.Provider value={compoundSx}>
          {children}
        </ParentContext.Provider>
      </DripsyText>
    );
  }
);

Text.displayName = "Text";

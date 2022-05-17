import { ComponentProps, createContext, forwardRef, useContext } from "react";
import type { Text as TextType } from "react-native";

import type { TW } from "design-system/tailwind/types";
import { textSizes } from "design-system/typography";

import { ViewProps } from "../view";
import { Text as StyledText } from "./text";

export type TextProps = ComponentProps<typeof StyledText>;

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
      variant,
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
    },
    ref
  ) => {
    const parentTw = useContext(ParentContext);

    // TODO: review this + implement variants

    // const parentTwProps = tailwind(
    //   typeof parentTw === "string" ? parentTw : parentTw?.join(" ")
    // );
    // const twProps = tailwind(Array.isArray(tw) ? tw.join(" ") : tw);
    // const compoundTw = {
    //   ...parentTwProps,
    //   ...twProps,
    // };

    const compoundTw = `${tw} ${parentTw}`;

    return (
      <StyledText
        tw={compoundTw}
        nativeID={nativeID}
        // @ts-ignore Dripsy‘s Text component issue
        ref={ref}
        variant={variant}
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
        <ParentContext.Provider value={compoundTw}>
          {children}
        </ParentContext.Provider>
      </StyledText>
    );
  }
);

Text.displayName = "Text";

export { linkify } from "./linkify";

import { useEffect, useRef } from "react";
import { UIManager, Platform } from "react-native";

import { Text, Props as TextProps } from "@showtime-xyz/universal.text";

import { useClampText } from "./use-clamp-text";

type MultiClampTextProps = {
  text?: string;
  ellipsis?: string;
  expandButtonWidth?: number;
  foldText?: string;
  expandText?: string;
} & TextProps;

export const MultiClampText = ({
  text = "",
  tw,
  numberOfLines = 3,
  ellipsis = "...",
  expandButtonWidth = 10,
  foldText = " Less",
  expandText = " More",
}: MultiClampTextProps) => {
  const textRef = useRef<Element | Text>(null);
  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }

      return () => {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(false);
        }
      };
    }
  }, []);

  const {
    showMore,
    onShowLess,
    onShowMore,
    showLess,
    innerText,
    onTextLayout,
  } = useClampText({
    element: textRef.current as Element,
    rows: numberOfLines,
    text,
    expandButtonWidth,
    ellipsis,
  });

  if (!text || text === "") {
    return null;
  }

  return (
    <Text tw={tw} ref={textRef as any} onTextLayout={onTextLayout}>
      {innerText}
      {(showMore || showLess) && (
        <Text
          onPress={showMore ? onShowMore : onShowLess}
          tw="text-sm font-bold text-gray-900 dark:text-white"
        >
          {showMore ? expandText : foldText}
        </Text>
      )}
    </Text>
  );
};

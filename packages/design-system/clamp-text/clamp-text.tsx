import { useRef, ReactNode } from "react";
import { Platform } from "react-native";

import { Text } from "@showtime-xyz/universal.text";

import { useClampText } from "./use-clamp-text";

export type ClampTextProps = {
  text?: string | Iterable<ReactNode> | null;
  ellipsis?: string;
  expandButtonWidth?: number;
  foldText?: string | undefined;
  expandText?: string | undefined;
  maxLines?: number;
  tw?: string;
};

export const ClampText = ({
  text = "",
  tw,
  maxLines = 2,
  ellipsis = "...",
  expandButtonWidth = 10,
  foldText = "Less",
  expandText = "More",
}: ClampTextProps) => {
  const textRef = useRef<Element | Text>(null);

  const isPureText = typeof text === "string";

  const {
    showMore,
    onShowLess,
    onShowMore,
    showLess,
    innerText,
    onTextLayout,
  } = useClampText({
    element: textRef.current as HTMLElement,
    rows: maxLines,
    text,
    expandButtonWidth,
    ellipsis,
    expandText,
    foldText,
  });

  if (!text || text === "") {
    return null;
  }

  return (
    <Text tw={tw} ref={textRef as any} onTextLayout={onTextLayout}>
      {innerText}
      {(showMore || showLess) && (isPureText || Platform.OS !== "web") && (
        <Text
          onPress={showMore ? onShowMore : onShowLess}
          tw="text-sm font-bold text-gray-900 dark:text-white"
        >
          {` ${showMore ? expandText : foldText}`}
        </Text>
      )}
    </Text>
  );
};

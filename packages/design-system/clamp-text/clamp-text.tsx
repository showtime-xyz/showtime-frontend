import { useRef, ReactNode, useState } from "react";
import { Platform } from "react-native";

import { Text } from "@showtime-xyz/universal.text";

import { useClampText } from "./use-clamp-text";

export type ClampTextProps = {
  text?: string | Iterable<ReactNode>;
  ellipsis?: string;
  expandButtonWidth?: number;
  foldText?: string;
  expandText?: string;
  maxLines?: number;
  tw?: string;
};

export const ClampText = ({
  text = "",
  tw,
  maxLines = 2,
  ellipsis = "...",
  expandButtonWidth = 10,
  foldText = " Less",
  expandText = " More",
}: ClampTextProps) => {
  const textRef = useRef<Element | Text>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const isPureText = typeof text === "string";

  const {
    showMore,
    onShowLess,
    onShowMore,
    showLess,
    innerText,
    onTextLayout,
  } = useClampText({
    element: textRef.current as Element,
    rows: maxLines,
    text,
    expandButtonWidth,
    ellipsis,
  });

  if (!text || text === "") {
    return null;
  }

  return (
    <>
      <Text
        tw={tw}
        ref={textRef as any}
        style={Platform.select({
          web: {
            "-webkit-mask-image": showMore
              ? `linear-gradient(to top, transparent 0%, transparent 2rem, rgb(0, 0, 0) 2rem, rgb(0, 0, 0) 100%), linear-gradient(to right, rgb(0, 0, 0) 0%, rgb(0, 0, 0) ${
                  containerWidth / 2
                }px, transparent ${containerWidth}px, transparent 100%)`
              : null,
          } as any,
          default: undefined,
        })}
        onTextLayout={onTextLayout}
        onLayout={(e) => {
          setContainerWidth(e.nativeEvent.layout.width);
        }}
      >
        {innerText}
        {(showMore || showLess) && (isPureText || Platform.OS !== "web") && (
          <Text
            onPress={showMore ? onShowMore : onShowLess}
            tw="text-sm font-bold text-gray-900 dark:text-white"
          >
            {showMore ? expandText : foldText}
          </Text>
        )}
      </Text>
      {!isPureText && Platform.OS === "web" && (showMore || showLess) && (
        <Text
          onPress={showMore ? onShowMore : onShowLess}
          tw="bottom-0 ml-0 text-sm font-bold text-gray-900 dark:text-white"
          style={{
            right: 0,
            position: showMore ? "absolute" : "relative",
            marginTop: showMore ? 0 : 8,
          }}
        >
          {showMore ? expandText : foldText}
        </Text>
      )}
    </>
  );
};

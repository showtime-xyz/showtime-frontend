import { useEffect, useRef, useMemo } from "react";
import { UIManager, Platform } from "react-native";

import { Text, Props as TextProps } from "@showtime-xyz/universal.text";

import { removeTags } from "app/utilities";

import { useClampText } from "./use-clamp-text";

type Props = {
  text?: string;
} & TextProps;

export const MultiClampText = ({ text = "", tw, numberOfLines = 3 }: Props) => {
  const textRef = useRef<Element | Text>(null);
  const description = useMemo(() => (text ? removeTags(text) : ""), [text]);
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
    text: description,
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
          {showMore ? " More" : " Less"}
        </Text>
      )}
    </Text>
  );
};

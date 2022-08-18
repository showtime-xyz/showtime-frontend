import { useState, useLayoutEffect, useRef } from "react";
import { Platform } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
// Todo: now Tooltip component seems to no working on dist floder,it need to check it.
import { Tooltip } from "@showtime-xyz/universal.tooltip";
import { View } from "@showtime-xyz/universal.view";

type Props = {
  title?: string;
  cardMaxWidth?: number;
  disableTooltip?: boolean;
};

export function Title({ title, cardMaxWidth, disableTooltip = false }: Props) {
  const [isUseTooltip, setIsOverflow] = useState(
    Platform.OS === "web" && !disableTooltip
  );
  const textRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (textRef.current && Platform.OS === "web") {
      // use range width instead of scrollWidth to determine whether the text is overflowing
      // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
      const range = document.createRange();
      range.setStart(textRef.current, 0);
      range.setEnd(textRef.current, textRef.current.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      setIsOverflow(
        rangeWidth + 16 > textRef.current.offsetWidth ||
          textRef.current.scrollWidth > textRef.current.offsetWidth
      );
    }
  }, [title]);

  if (!title) return null;

  return (
    <View ref={textRef} tw="px-4 pt-4">
      {isUseTooltip ? (
        <Tooltip
          delay={300}
          text={title}
          contentStyle={{
            maxWidth: cardMaxWidth,
          }}
        >
          <Text
            tw="font-space-bold text-lg !leading-8 text-black dark:text-white"
            numberOfLines={1}
          >
            {title}
          </Text>
        </Tooltip>
      ) : (
        <Text
          tw="font-space-bold text-lg !leading-8 text-black dark:text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

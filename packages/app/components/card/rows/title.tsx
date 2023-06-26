import { useState, useLayoutEffect, useRef } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import type { TW } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import * as Tooltip from "design-system/tooltip";

type Props = {
  title?: string;
  cardMaxWidth?: number;
  disableTooltip?: boolean;
  tw?: TW;
};

export function Title({ title, disableTooltip = false, tw }: Props) {
  const isDark = useIsDarkMode();
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
    <View ref={textRef} tw={tw ?? "px-4 pt-4"}>
      {isUseTooltip ? (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Text
              tw="inline-block overflow-ellipsis whitespace-nowrap text-lg !leading-8 text-black dark:text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="bottom">
              <Tooltip.Text text={title} textColor={isDark ? "#000" : "#fff"} />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      ) : (
        <Text
          tw="text-lg !leading-8 text-black dark:text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

import { useMemo } from "react";
import { ViewStyle } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowTop } from "@showtime-xyz/universal.icon";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Placement } from "./get-placement";
import { TooltipProps } from "./types";

const DARK_SHADOW =
  "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.05)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))";
const LIGHT_SHADOW =
  "drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.5)) drop-shadow(0px 8px 16px rgba(255, 255, 255, 0.1))";

const ARROW_SIZE = {
  width: 16,
  height: 8,
};

export const TooltipContent: React.FC<
  Pick<
    TooltipProps,
    | "text"
    | "placement"
    | "offset"
    | "textTw"
    | "customContent"
    | "contentStyle"
  >
> = ({
  text,
  placement = Placement.bottom,
  offset = 0,
  textTw,
  contentStyle,
  customContent,
}) => {
  const isDark = useIsDarkMode();
  const color = useMemo(
    () => (isDark ? colors.gray[700] : colors.black),
    [isDark]
  );
  const getArrowOffset = useMemo<ViewStyle>(() => {
    switch (placement) {
      case Placement.top:
        return {
          top: -ARROW_SIZE.height - offset,
        };
      case Placement.bottom:
        return {
          top: ARROW_SIZE.height + offset,
        };
      default:
        return {};
    }
  }, [offset, placement]);

  const getArrowStyle = useMemo<ViewStyle>(() => {
    // ofset 1px for `border`
    const arrowHeight = ARROW_SIZE.height - 1;
    switch (placement) {
      case Placement.top:
        return {
          bottom: -arrowHeight,
          transform: [
            {
              rotate: "180deg",
            },
          ],
        };
      case Placement.bottom:
        return {
          top: -arrowHeight,
        };
      default:
        return {};
    }
  }, [placement]);

  if (customContent) return customContent;

  return (
    <View
      tw="relative items-center justify-center rounded-2xl px-4 py-2"
      style={[
        // @ts-ignore
        {
          filter: isDark ? DARK_SHADOW : LIGHT_SHADOW,
          backgroundColor: color,
        },
        getArrowOffset,
        contentStyle,
      ]}
    >
      <Text tw={["text-center text-base font-bold text-white", textTw ?? ""]}>
        {text}
      </Text>
      <View tw="z-1 absolute self-center" style={getArrowStyle}>
        <ArrowTop color={color} {...ARROW_SIZE} />
      </View>
    </View>
  );
};

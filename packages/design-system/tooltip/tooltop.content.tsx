import { useMemo } from "react";
import { ViewStyle } from "react-native";

import { useIsDarkMode } from "../hooks";
import { ArrowTop } from "../icon";
import { tw } from "../tailwind";
import { colors } from "../tailwind/colors";
import { Text } from "../text";
import { View } from "../view";
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
  }, [placement]);

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
      style={[
        tw.style("relative items-center justify-center rounded-2xl px-4 py-2"),
        {
          filter: isDark ? DARK_SHADOW : LIGHT_SHADOW,
          backgroundColor: color,
        },
        getArrowOffset,
        contentStyle,
      ]}
    >
      <Text tw={`text-center text-base font-bold text-white ${textTw}`}>
        {text}
      </Text>
      <View style={[tw.style("z-1 absolute self-center"), getArrowStyle]}>
        <ArrowTop color={color} {...ARROW_SIZE} />
      </View>
    </View>
  );
};

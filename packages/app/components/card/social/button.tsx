import { useMemo } from "react";

import { useOnPress, useOnHover } from "@showtime-xyz/universal.hooks";
import {
  Heart,
  HeartFilled,
  Message,
  Boost,
  Gift,
} from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { formatNumber } from "app/utilities";

type Props = {
  variant: "like" | "comment" | "boost" | "gift";
  count: number;
  state?: "default" | "hover" | "tap" | "disabled";
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

function Button({
  variant,
  state = "default",
  count,
  active = false,
  onPress,
  disabled,
}: Props) {
  const { onPressIn, onPressOut, pressed } = useOnPress();
  const { onHoverIn, onHoverOut, hovered } = useOnHover();
  const isHovered = hovered.value || state === "hover";
  const isDisabled = disabled || state === "disabled";
  const isHoverable = !isDisabled;
  const isPressed = active || pressed.value || state === "tap";

  const Icon =
    variant === "like"
      ? active
        ? HeartFilled
        : Heart
      : variant === "comment"
      ? Message
      : variant === "gift"
      ? Gift
      : Boost;
  const backgroundColor = "bg-gray-100";
  const backgroundHoverColor = getBackgroundHoverColor(variant);
  const iconActiveColor = getIconActiveColor(variant);
  const textActiveColor = getTextActiveColor(variant);
  const hoverColor = getHoverColor(variant);
  const defaultColor = active
    ? textActiveColor
    : tw.style("text-gray-600 dark:text-gray-400");

  // TODO: animate color with Moti and useDerivedValue
  const textStyle = useMemo(
    () => ({
      color:
        isHoverable && isHovered
          ? hoverColor
          : active
          ? textActiveColor.color
          : defaultColor.color,
    }),
    [isHoverable, isHovered, hoverColor, active, textActiveColor, defaultColor]
  );

  return (
    <PressableScale
      tw={[
        "h-8 flex-row items-center rounded-full p-2 dark:bg-gray-900",
        isHovered ? backgroundHoverColor : backgroundColor,
        isPressed && !isDisabled ? "dark:bg-gray-800" : "",
        isDisabled ? "opacity-40" : "", // TODO: add `cursor-not-allowed` utility to twrnc
      ]}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Icon
        width={16}
        height={16}
        color={
          active
            ? iconActiveColor
            : isHovered && !isDisabled
            ? hoverColor
            : tw.color("gray-400")
        }
      />
      <Text
        tw={["text-13 font-bold", count > 0 ? "ml-1" : ""]}
        // @ts-ignore
        style={textStyle}
      >
        {count > 0 ? formatNumber(count) : ""}
      </Text>
    </PressableScale>
  );
}

// Get background hover color
function getBackgroundHoverColor(variant: Props["variant"]) {
  switch (variant) {
    case "like":
      return "bg-red-50";
    case "comment":
      return "bg-indigo-50";
    case "boost":
      return "bg-green-50";
    case "gift":
      return "bg-indigo-50";
    default:
      return "";
  }
}

// Get icon active color
function getIconActiveColor(variant: Props["variant"]) {
  switch (variant) {
    case "like":
      return tw.color("red-500");
    case "comment":
      return tw.color("indigo-600");
    case "boost":
      return tw.color("green-600");
    case "gift":
      return tw.color("indigo-600");
    default:
      return tw.color("gray-400");
  }
}

// Get text active color
function getTextActiveColor(variant: Props["variant"]) {
  switch (variant) {
    case "like":
      return tw.style("text-red-500");
    case "comment":
      return tw.style("text-indigo-600 dark:text-indigo-500");
    case "boost":
      return tw.style("text-green-600 dark:text-green-500");
    case "gift":
      return tw.style("text-indigo-600 dark:text-indigo-500");
    default:
      return tw.style("text-gray-600 dark:text-gray-400");
  }
}

// Get hover color
function getHoverColor(variant: Props["variant"]) {
  switch (variant) {
    case "like":
      return tw.color("red-500");
    case "comment":
      return tw.color("indigo-500");
    case "boost":
      return tw.color("green-500");
    case "gift":
      return tw.color("indigo-500");
    default:
      return "";
  }
}

export { Button };

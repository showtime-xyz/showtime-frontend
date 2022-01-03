import { useMemo } from "react";

import { Pressable, Text } from "design-system";
import { HeartFilled, MessageFilled, Boost } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { useOnPress, useOnHover } from "design-system/hooks";

type Props = {
  variant: "like" | "comment" | "boost";
  count: number;
  state?: "default" | "hover" | "tap" | "disabled";
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

// Format big numbers
function formatNumber(number: number) {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}m`;
  } else if (number > 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    return number;
  }
}

// Capitalize first letter of string
function formatString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
      ? HeartFilled
      : variant === "comment"
      ? MessageFilled
      : Boost;
  const backgroundColor = "bg-gray-100";
  const backgroundHoverColor =
    variant === "like"
      ? "bg-red-50"
      : variant === "comment"
      ? "bg-indigo-50"
      : variant === "boost"
      ? "bg-green-50"
      : "";
  const iconActiveColor =
    variant === "like"
      ? tw.color("red-500")
      : variant === "comment"
      ? tw.color("indigo-600")
      : variant === "boost"
      ? tw.color("green-600")
      : tw.color("gray-400");
  const textActiveColor =
    variant === "like"
      ? tw.style("text-red-500")
      : variant === "comment"
      ? tw.style("text-indigo-600 dark:text-indigo-500")
      : variant === "boost"
      ? tw.style("text-green-600 dark:text-green-500")
      : tw.style("text-gray-600 dark:text-gray-400");
  const hoverColor =
    variant === "like"
      ? tw.color("red-500")
      : variant === "comment"
      ? tw.color("indigo-500")
      : variant === "boost"
      ? tw.color("green-500")
      : "";
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
    <Pressable
      tw={[
        "h-8 p-2 flex-row items-center rounded-full dark:bg-gray-900",
        isHovered ? backgroundHoverColor : backgroundColor,
        isPressed && !isDisabled ? "dark:bg-gray-800" : "",
        isDisabled ? "opacity-40 cursor-not-allowed" : "",
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
        color={active ? iconActiveColor : isHovered && !isDisabled ? hoverColor : tw.color("gray-400")}
      />
      <Text
        variant="text-13"
        tw="ml-1 font-bold"
        // @ts-ignore
        sx={textStyle}
      >
          {count > 0 ? formatNumber(count) : formatString(variant)}
      </Text>
    </Pressable>
  );
}

export { Button };

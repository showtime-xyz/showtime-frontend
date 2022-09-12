import React, { useCallback, useMemo } from "react";
import { Pressable, GestureResponderEvent } from "react-native";

import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useIsDarkMode, useOnHover } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { SelectProps } from "../types";

interface SelectItemProps<T> extends Pick<SelectProps<T>, "size"> {
  value: T;
  label: string;
  disabled?: boolean;
  onPress?: (value: T) => void;
  onClick?: (e: GestureResponderEvent) => void;
}

const BACKGROUND_MAPPER = {
  default: [colors.black, colors.white],
  hover: [colors.gray[800], colors.gray[200]],
};

export function SelectItem<T>({
  label,
  value,
  disabled,
  size,
  onPress,
  onClick,
  ...rest
}: SelectItemProps<T>) {
  //#region hooks
  const isDarkMode = useIsDarkMode();
  const { onHoverIn, onHoverOut, hovered } = useOnHover();
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: disabled ? 0.4 : 1,
      backgroundColor: hovered.value
        ? BACKGROUND_MAPPER.hover[isDarkMode ? 0 : 1]
        : BACKGROUND_MAPPER.default[isDarkMode ? 0 : 1],
    }),
    [isDarkMode, hovered, disabled]
  );
  const containerStyle = useMemo(
    () => [
      {
        padding: 8,
        margin: 4,
        borderRadius: 8,
        // Not sure why TS is not happy with the type of the styles below
        justifyContent: "space-between",
      },
      containerAnimatedStyle,
    ],
    [containerAnimatedStyle]
  );
  //#endregion

  //#region callbacks
  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (onClick) {
        onClick(e);
      }

      if (onPress) {
        onPress(value);
      }
    },
    [value, onClick, onPress]
  );
  //#endregion

  return (
    <Pressable
      //@ts-ignore - web only prop
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onPress={handlePress}
      {...rest}
    >
      <Animated.View
        // @ts-ignore
        style={containerStyle}
      >
        <Text
          tw={[
            "whitespace-nowrap font-medium text-gray-900 dark:text-white",
            size === "regular" ? "text-sm" : "text-sm",
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

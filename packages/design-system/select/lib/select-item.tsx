import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, Pressable } from "react-native";

import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTailwind } from "tailwindcss-react-native";

import { useIsDarkMode, useOnHover } from "../../hooks";
import { colors } from "../../tailwind/colors";
import { Text } from "../../text";
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
  const tailwind = useTailwind();
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
      tailwind(`p-2 m-1 items-center justify-between rounded-lg`),
      containerAnimatedStyle,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
      <Animated.View style={containerStyle}>
        <Text
          tw={`font-medium text-gray-900 dark:text-white ${
            size === "regular" ? "text-sm" : "text-sm"
          }`}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

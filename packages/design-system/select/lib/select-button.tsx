import React, { forwardRef, useMemo } from "react";
import { Pressable } from "react-native";

import Animated, { useAnimatedStyle } from "react-native-reanimated";

import {
  useIsDarkMode,
  useOnHover,
  useOnPress,
} from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { SelectProps } from "../types";
import { ChevronDownIcon } from "./chevron-down-icon";

interface SelectButtonProps extends Pick<SelectProps<any>, "size"> {
  open: boolean;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  onPress?: () => void;
}

const BACKGROUND_MAPPER = {
  default: [colors.black, colors.white],
  hover: [colors.gray[800], colors.gray[200]],
  pressed: [colors.gray[700], colors.gray[300]],
};

export const SelectButton: React.FC<SelectButtonProps> = forwardRef(
  ({ label, open, disabled, size, onPress, onClick, ...rest }, ref) => {
    //#region hooks
    const isDarkMode = useIsDarkMode();
    const { onHoverIn, onHoverOut, hovered } = useOnHover();
    const { onPressIn, onPressOut, pressed } = useOnPress();
    //#endregion

    const iconSize = useMemo(() => (size === "regular" ? 30 : 16), [size]);

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(
      () => ({
        opacity: disabled ? 0.4 : 1,
        backgroundColor: pressed.value
          ? BACKGROUND_MAPPER.pressed[isDarkMode ? 0 : 1]
          : hovered.value
          ? BACKGROUND_MAPPER.hover[isDarkMode ? 0 : 1]
          : BACKGROUND_MAPPER.default[isDarkMode ? 0 : 1],
      }),
      [isDarkMode, hovered, pressed, disabled]
    );

    const containerStyle = useMemo(
      () => [
        {
          paddingVertical: size === "regular" ? 11 : 7,
          paddingLeft: 16,
          paddingRight: 8,
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: isDarkMode ? colors.gray[800] : colors.gray[200],
          // Not sure why TS is not happy with the type of the styles below
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        containerAnimatedStyle,
      ],
      [containerAnimatedStyle, size, isDarkMode]
    );
    //#endregion

    return (
      <Pressable
        //@ts-ignore
        ref={ref}
        //@ts-ignore - web only prop
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        onPress={onPress || onClick}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        {...rest}
      >
        <Animated.View
          // @ts-ignore
          style={containerStyle}
        >
          <Text
            tw={[
              "mr-2 font-bold text-gray-900 dark:text-white",
              size === "regular" ? "text-sm" : "text-xs",
            ]}
          >
            {label}
          </Text>
          <ChevronDownIcon
            height={iconSize}
            width={iconSize}
            open={open}
            aria-hidden="true"
          />
        </Animated.View>
      </Pressable>
    );
  }
);

SelectButton.displayName = "SelectButton";

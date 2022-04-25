import React, { forwardRef, useMemo } from "react";

import { Pressable } from "dripsy";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useIsDarkMode, useOnHover, useOnPress } from "../../hooks";
import { tw } from "../../tailwind";
import { colors } from "../../tailwind/colors";
import { Text } from "../../text";
import { SelectProps } from "../types";
import { ChevronDownIcon } from "./chevron-down-icon";

interface SelectButtonProps extends Pick<SelectProps, "size"> {
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
        tw`${
          size === "regular" ? "py-3" : "py-2"
        } flex-row items-center justify-between rounded-full pl-4 pr-2 border border-gray-200 dark:border-gray-800`,
        containerAnimatedStyle,
      ],
      [containerAnimatedStyle, size]
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
        <Animated.View style={containerStyle}>
          <Text
            tw={`font-bold text-gray-900 dark:text-white ${
              size === "regular" ? "text-sm" : "text-xs"
            } mr-2`}
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

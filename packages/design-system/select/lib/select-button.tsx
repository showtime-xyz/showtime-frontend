import React, { forwardRef, memo, useMemo } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Pressable } from "dripsy";
import { useIsDarkMode, useOnHover, useOnPress } from "../../hooks";
import { Text } from "../../text";
import { ChevronDownIcon } from "./chevron-down-icon";
import { tw, } from "../../tailwind";
import { colors } from "../../tailwind/colors";
import { SelectProps } from "../types";

interface SelectButtonProps extends Pick<SelectProps, "size"> {
  open: boolean;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const BACKGROUND_MAPPER = {
  default: [colors.gray[900], colors.gray[100]],
  hover: [colors.gray[800], colors.gray[200]],
  pressed: [colors.gray[700], colors.gray[300]],
};

export const SelectButton: React.FC<SelectButtonProps> = forwardRef(
  ({ label, open, disabled, size, onClick, ...rest }, ref) => {
    //#region hooks
    const isDarkMode = useIsDarkMode();
    const { onHoverIn, onHoverOut, hovered } = useOnHover();
    const { onPressIn, onPressOut, pressed } = useOnPress();
    //#endregion

    const iconSize = useMemo(() => (size === "regular" ? 30 : 24), [size]);

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
        tw`${size === "regular" ? "px-4 py-3" : "px-3 py-2"} flex-row items-center justify-between rounded-full`,
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
        onPress={onClick}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        {...rest}
      >
        <Animated.View style={containerStyle}>
          <Text tw={`font-bold text-gray-900 dark:text-gray-100 ${ size === 'regular' ? 'text-sm' : 'text-xs'} mr-2`}>
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

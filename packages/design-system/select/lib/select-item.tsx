import React, { useMemo } from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Pressable } from "dripsy";
import { useIsDarkMode, useOnHover, useOnPress } from "../../hooks";
import { Text } from "../../text";
import { tw } from "../../tailwind";
import { colors } from "../../tailwind/colors";
import { SelectProps } from "../types";

interface SelectItemProps extends Pick<SelectProps, "size"> {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const BACKGROUND_MAPPER = {
  default: [colors.black, colors.white],
  hover: [colors.gray[800], colors.gray[200]],
};

export const SelectItem: React.FC<SelectItemProps> = ({
  label,
  disabled,
  size,
  onClick,
  ...rest
}) => {
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
      tw`p-2 m-1 items-center justify-between rounded-xl`,
      containerAnimatedStyle,
    ],
    []
  );
  //#endregion
  return (
    <Pressable
      //@ts-ignore - web only prop
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onPress={onClick}
      {...rest}
    >
      <Animated.View style={containerStyle}>
        <Text
          tw={`font-medium text-gray-900 dark:text-white ${
            size === "regular" ? "text-sm" : "text-xs"
          }`}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

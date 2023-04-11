import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";

import { breakpoints } from "design-system/theme";

export const useSocialColor = () => {
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  return {
    iconColor: isMdWidth
      ? isDark
        ? colors.gray[400]
        : colors.gray[900]
      : colors.white,
  };
};

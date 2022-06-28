import { useWindowDimensions } from "react-native";

import { colors } from "@showtime-xyz/universal.tailwind";

import { useIsDarkMode } from "design-system/hooks";
import { breakpoints } from "design-system/theme";

export const useSocialColor = () => {
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  return {
    textColors: [colors.gray[900], isMdWidth ? colors.gray[400] : colors.white],
    iconColor: isDark
      ? isMdWidth
        ? colors.gray[400]
        : colors.white
      : colors.gray[900],
  };
};

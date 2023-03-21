import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "design-system/hooks";
import { colors } from "design-system/tailwind";
import { breakpoints } from "design-system/theme";

export const useSocialColor = () => {
  const isDark = useIsDarkMode();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  return {
    iconColor: isDark
      ? isMdWidth
        ? colors.gray[400]
        : colors.white
      : colors.gray[900],
  };
};

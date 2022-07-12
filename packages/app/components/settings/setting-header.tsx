import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { CARD_DARK_SHADOW, CARD_LIGHT_SHADOW } from "design-system/theme";

export const SettingHeaderSection = ({ title = "" }) => {
  const isDark = useIsDarkMode();
  return (
    <View
      tw="items-center bg-white dark:bg-black md:mb-8"
      style={Platform.select({
        web: {
          // @ts-ignore
          boxShadow: isDark ? CARD_DARK_SHADOW : CARD_LIGHT_SHADOW,
        } as any,
        default: {},
      })}
    >
      <View tw="w-full max-w-screen-2xl flex-row justify-between bg-white py-4 px-4 dark:bg-black">
        <Text tw="font-space-bold text-2xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </Text>
      </View>
    </View>
  );
};

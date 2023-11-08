import { useCallback } from "react";
import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Songs, Saved, Tokens } from "@showtime-xyz/universal.icon";
import {
  ScollableTabBar,
  TabBarSingle,
} from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

const TabBar = Platform.OS === "web" ? TabBarSingle : ScollableTabBar;
export const ProfileTabBar = (props: any) => {
  const isDark = useIsDarkMode();

  const renderIcon = useCallback(
    ({ route, focused }: any) => {
      const iconColor = focused
        ? isDark
          ? colors.gray[100]
          : colors.gray[900]
        : colors.gray[500];

      switch (route.key) {
        case "song_drops_created":
          return <Songs height={16} color={iconColor} />;
        case "song_drops_collected":
          return <Saved height={16} color={iconColor} />;
        case "tokens":
          return <Tokens height={16} color={iconColor} />;
        default:
          return null;
      }
    },
    [isDark]
  );
  return (
    <View tw="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <TabBar
        {...props}
        gap={10}
        renderIcon={renderIcon}
        tabStyle={{
          paddingVertical: 8,
          flexDirection: "row",
          paddingHorizontal: 0,
        }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </View>
  );
};

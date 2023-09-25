import { useCallback } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { SongsTab, SavedTab, TokensTab } from "@showtime-xyz/universal.icon";
import { ScollableTabBar } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

export const ProfileTabBar = (props: any) => {
  const isDark = useIsDarkMode();

  const renderIcon = useCallback(
    ({ route, focused, color }: any) => {
      const iconColor = focused
        ? isDark
          ? colors.gray[100]
          : colors.gray[900]
        : colors.gray[500];

      switch (route.key) {
        case "created":
          return <SongsTab height={16} color={iconColor} />;
        case "owned":
          return <SavedTab height={16} color={iconColor} />;
        case "tokens":
          return <TokensTab height={16} color={iconColor} />;
        default:
          return null;
      }
    },
    [isDark]
  );

  return (
    <View tw="border-b border-gray-200 bg-white px-12 dark:border-gray-800 dark:bg-black">
      <ScollableTabBar
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

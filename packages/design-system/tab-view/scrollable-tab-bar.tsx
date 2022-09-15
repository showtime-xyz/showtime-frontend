import React, { useCallback } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from "react-native-tab-view-next";

import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Route } from "./index";

type State = NavigationState<Route>;
interface Props extends SceneRendererProps {
  style?: StyleProp<ViewStyle>;
}

export const ScollableTabBar = ({
  style,
  ...rest
}: Props & { navigationState: State }) => {
  const isDark = useIsDarkMode();
  const onTabPress = useCallback(() => {
    Haptics.impactAsync();
  }, []);

  return (
    <View tw="web:border-b-0 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-black">
      <TabBar
        {...rest}
        contentContainerStyle={{
          alignItems: "center",
        }}
        style={[
          styles.tabbar,
          {
            backgroundColor: isDark ? "#000" : "#fff",
            position: "relative",
          },
          style,
        ]}
        indicatorContainerStyle={{ zIndex: 1 }}
        labelStyle={{
          color: isDark ? colors.white : colors.gray[900],
          fontWeight: "bold",
          fontSize: 14,
          textTransform: "none",
        }}
        indicatorStyle={{ backgroundColor: isDark ? "#FFF" : colors.gray[900] }}
        tabStyle={{ paddingVertical: 8 }}
        onTabPress={onTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});

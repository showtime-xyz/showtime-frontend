import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import { NavigationState, TabBar, TabBarProps } from "react-native-tab-view";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";

import { Route } from "./index";

type State = NavigationState<Route>;
interface Props extends TabBarProps<any> {
  style?: StyleProp<ViewStyle>;
}

export const ScollableTabBar = ({
  style,
  ...rest
}: Props & { navigationState: State }) => {
  const isDark = useIsDarkMode();

  return (
    <TabBar
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
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
        marginHorizontal: 0,
      }}
      indicatorStyle={{ backgroundColor: isDark ? "#FFF" : colors.gray[900] }}
      tabStyle={{
        paddingVertical: 8,
        flexDirection: "row",
      }}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  tabbar: {
    elevation: 0,
    shadowOpacity: 0,
  },
});

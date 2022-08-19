import React, { useCallback } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from "react-native-tab-view-next";

import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Route } from "design-system/tab-view";

import { Haptics } from "./haptics";

type State = NavigationState<Route>;
interface Props extends SceneRendererProps {
  style?: StyleProp<ViewStyle>;
}

export const ScollableTabBar = ({
  style,
  ...rest
}: Props & { navigationState: State }) => {
  const onTabPress = useCallback(() => {
    Haptics.impactAsync();
  }, []);
  return (
    <View tw="web:border-b-0 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-black">
      <TabBar
        {...rest}
        contentContainerStyle={tw.style("items-center")}
        style={[
          styles.tabbar,
          tw.style("bg-white dark:bg-black shadow-none relative"),
          style,
        ]}
        indicatorContainerStyle={tw.style("z-1")}
        labelStyle={tw.style(
          "text-sm font-bold text-gray-900 dark:text-white normal-case"
        )}
        indicatorStyle={tw.style("bg-gray-900 dark:bg-white")}
        tabStyle={tw.style("px-2")}
        onTabPress={onTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    elevation: 0,
  },
});

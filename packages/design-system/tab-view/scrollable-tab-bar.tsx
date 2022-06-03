import React, { useState, useCallback, useRef } from "react";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";

import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from "react-native-tab-view/src";

import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import useContentWidth from "app/hooks/use-content-width";
import { Haptics } from "app/lib/haptics";

import { Pressable } from "../pressable";
import { Route } from "./src/types";
import { memoize } from "./src/utils";

type State = NavigationState<Route>;
interface Props extends SceneRendererProps {
  style?: StyleProp<ViewStyle>;
}

export const ScollableTabBar = ({
  style,
  ...rest
}: Props & { navigationState: State }) => {
  const indicatorFadeAnim = useRef(new Animated.Value(0)).current;

  const contentWidth = useContentWidth();
  const [tabsWidth, setTabsWidth] = useState<{
    [index: number]: number;
  }>({});

  const getActiveOpacityText = memoize(
    (
      position: Animated.AnimatedInterpolation,
      routes: Route[],
      tabIndex: number
    ) => {
      if (routes.length > 1) {
        const inputRange = routes.map((_, i) => i);
        const outputRange = inputRange.map((i) => (i === tabIndex ? 1 : 0.6));
        return position.interpolate({
          inputRange,
          outputRange,
        });
      } else {
        return 1;
      }
    }
  );

  const getTranslateX = memoize(
    (position: Animated.AnimatedInterpolation, routes: Route[]) => {
      if (
        routes.length === 0 ||
        Object.keys(tabsWidth)?.length === 0 ||
        Object.keys(tabsWidth)?.length !== routes.length
      ) {
        return -contentWidth;
      }

      if (routes.length <= 1) return tabsWidth[0] / 2 + 8 ?? -contentWidth;
      const inputRange = routes.map((_, i) => i);
      const indicatorOutputRange = Object.values(tabsWidth).map(
        (value) => value / contentWidth
      );
      // every index contains widths at all previous indices
      const outputRange = routes.reduce<number[]>((acc, _, i) => {
        if (i === 0)
          return [
            -((contentWidth - contentWidth * indicatorOutputRange[i]) / 2) + 16,
          ];
        return [
          ...acc,
          acc[i - 1] + (tabsWidth[i - 1] + tabsWidth[i]) / 2 + 32,
        ];
      }, []);

      return position.interpolate({
        inputRange,
        outputRange,
        extrapolate: "clamp",
      });
    }
  );
  const getIndicatorScaleX = memoize(
    (position: Animated.AnimatedInterpolation, routes: Route[]) => {
      if (
        routes.length === 0 ||
        Object.keys(tabsWidth)?.length === 0 ||
        Object.keys(tabsWidth)?.length !== routes.length
      ) {
        return 0;
      }
      const inputRange = routes.map((_, i) => i);
      const outputRange = Object.values(tabsWidth).map(
        (value) => value / contentWidth
      );

      return position.interpolate({
        inputRange,
        outputRange,
        extrapolate: "clamp",
      });
    }
  );

  const onTabPress = useCallback(() => {
    Haptics.impactAsync();
  }, []);

  const onTabBarItemLayout = useCallback(
    ({
      navigationState,
      route,
      width,
    }: {
      navigationState: NavigationState<Route>;
      route: Route;
      width: number;
    }) => {
      const index = navigationState.routes.indexOf(route);
      setTabsWidth(
        Object.assign(tabsWidth, {
          [index]: width,
        })
      );
      if (index === navigationState.routes.length - 1) {
        Animated.timing(indicatorFadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    },
    [indicatorFadeAnim, tabsWidth]
  );

  return (
    <TabBar
      {...rest}
      contentContainerStyle={styles.contentContainerStyle}
      style={[
        styles.tabbar,
        tw.style(
          "bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 web:border-b-0"
        ),
        style,
      ]}
      indicatorContainerStyle={tw.style("z-1")}
      renderIndicator={({ position, navigationState }) => {
        return (
          <Animated.View
            style={[
              tw.style("bg-gray-900 dark:bg-white z-10"),
              {
                width: contentWidth,
                opacity: indicatorFadeAnim,
                transform: [
                  {
                    translateX: getTranslateX(position, navigationState.routes),
                  },
                  {
                    scaleX: getIndicatorScaleX(
                      position,
                      navigationState.routes
                    ),
                  },
                ],
              },
              styles.indicator,
            ]}
          />
        );
      }}
      onTabPress={onTabPress}
      renderTabBarItem={({
        onPress,
        onLongPress,
        onLayout,
        position,
        navigationState,
        route,
        key,
        ...rest
      }) => {
        return (
          <Pressable
            {...rest}
            style={styles.tabItem}
            onPress={onPress}
            onLongPress={onLongPress}
            key={key}
          >
            <Animated.View
              style={{
                opacity: getActiveOpacityText(
                  position,
                  navigationState.routes,
                  navigationState.routes.indexOf(route)
                ),
              }}
              onLayout={(e) => {
                onTabBarItemLayout({
                  route,
                  navigationState,
                  width: e.nativeEvent.layout.width,
                });
                onLayout?.(e);
              }}
            >
              <Text tw="text-sm font-bold text-gray-900 dark:text-white">
                {route.title}
              </Text>
            </Animated.View>
          </Pressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: "center",
  },
  indicator: {
    bottom: 0,
    height: 2,
    position: "absolute",
  },
  tabItem: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  tabbar: {
    position: "relative",
    shadowOpacity: 0,
  },
});

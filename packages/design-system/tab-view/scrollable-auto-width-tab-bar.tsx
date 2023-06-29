import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
  Platform,
} from "react-native";

import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from "react-native-tab-view";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";

import { Route } from "./";

type State = NavigationState<Route>;
interface Props extends SceneRendererProps {
  style?: StyleProp<ViewStyle>;
  maxContentWidth?: number;
}

export const ScollableAutoWidthTabBar = ({
  style,
  maxContentWidth = 1140,
  ...rest
}: Props & { navigationState: State }) => {
  const isDark = useIsDarkMode();
  const indicatorFadeAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const measuredTabWidths = React.useRef<Record<string, number>>({});

  const contentWidth = useMemo(
    () => (width < maxContentWidth ? width : maxContentWidth),
    [maxContentWidth, width]
  );
  const [tabsWidth, setTabsWidth] = useState<Record<string, number>>({});

  const getActiveOpacityText = (
    position: Animated.AnimatedInterpolation<number>,
    routes: Route[],
    tabIndex: number
  ) => {
    if (routes.length > 1) {
      const inputRange = routes.map((_, i) => i);
      const outputRange = inputRange.map((i) => (i === tabIndex ? 1 : 0.7));
      return position.interpolate({
        inputRange,
        outputRange,
      });
    } else {
      return 1;
    }
  };

  const getTranslateX = (
    position: Animated.AnimatedInterpolation<number>,
    routes: Route[]
  ) => {
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
      return [...acc, acc[i - 1] + (tabsWidth[i - 1] + tabsWidth[i]) / 2 + 32];
    }, []);

    if (routes.length === 1) return outputRange[0];

    return position.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });
  };

  const getIndicatorScaleX = (
    position: Animated.AnimatedInterpolation<number>,
    routes: Route[]
  ) => {
    const inputRange = routes.map((_, i) => i);
    const outputRange = Object.values(tabsWidth).map(
      (value) => value / contentWidth
    );

    if (inputRange.length === 1) return outputRange[0];

    return position.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });
  };

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
      measuredTabWidths.current[index] = width;

      if (
        navigationState.routes.every(
          (r, i) => typeof measuredTabWidths.current[i] === "number"
        )
      ) {
        setTabsWidth({ ...measuredTabWidths.current });
      }

      if (index === navigationState.routes.length - 1) {
        Animated.timing(indicatorFadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    },
    [indicatorFadeAnim]
  );

  return (
    <TabBar
      {...rest}
      contentContainerStyle={styles.contentContainerStyle}
      style={[
        styles.tabbar,
        {
          backgroundColor: isDark ? "#000" : "#FFF",
          borderColor: isDark ? colors.gray[800] : colors.gray[200],
          borderBottomWidth:
            Platform.OS === "web" ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
      indicatorContainerStyle={{ zIndex: 1 }}
      renderIndicator={({ position, navigationState }) => {
        if (
          navigationState.routes.length === 0 ||
          Object.keys(tabsWidth)?.length !== navigationState.routes.length
        )
          return null;
        return (
          <Animated.View
            style={[
              {
                backgroundColor: isDark ? "#FFF" : colors.gray[900],
                zIndex: 10,
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
      scrollEnabled
      tabStyle={styles.tabStyle}
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
            onLayout={onLayout}
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
              }}
            >
              <Text tw="text-sm font-bold text-gray-900 dark:text-white">
                {route.title}
                {Boolean(route.subtitle) && (
                  <Text tw="text-xs font-semibold text-gray-500">
                    {` ${route.subtitle}`}
                  </Text>
                )}
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
    elevation: 0,
  },
  tabStyle: {
    width: "auto",
  },
});

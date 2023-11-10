import { StyleSheet, useWindowDimensions, Platform } from "react-native";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MotiView } from "moti";
import { BorderlessButton as Pressable } from "react-native-gesture-handler";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useRedirectToScreen } from "app/hooks/use-redirect-to-screen";
import { useUser } from "app/hooks/use-user";
import { BlurView } from "app/lib/blurview";
import { BOTTOM_TABBAR_BASE_HEIGHT } from "app/lib/constants";
import { useBottomTabBarHeightCallback } from "app/lib/react-navigation/bottom-tabs";

import { useNavigationElements } from "./use-navigation-elements";

type ThemeBottomTabBarProps = BottomTabBarProps & {
  dark?: boolean;
};
export const ThemeBottomTabbar = ({
  navigation,
  state,
  descriptors,
  dark,
}: ThemeBottomTabBarProps) => {
  const { isAuthenticated } = useUser();
  const { width } = useWindowDimensions();
  const isDarkMode = useIsDarkMode();
  const redirectToScreen = useRedirectToScreen();
  const isDark = dark !== undefined ? dark : isDarkMode;

  const color = isDark ? colors.gray[100] : colors.gray[900];

  return (
    <View tw="flex-row bg-transparent pt-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            if (route.name !== "homeTab" && !isAuthenticated) {
              redirectToScreen({
                redirectedCallback: () => {
                  navigation.navigate({
                    name: route.name,
                    merge: true,
                    params: route.params,
                  });
                },
              });
            } else {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: route.params,
              });
            }
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <View key={route.key} tw="flex flex-1 items-center justify-center">
            <Pressable
              onLongPress={onLongPress}
              onPress={onPress}
              shouldActivateOnStart
              rippleColor={isDark ? colors.gray[700] : colors.gray[300]}
              rippleRadius={30}
              activeOpacity={0.7}
              hitSlop={10}
              exclusive
            >
              {options.tabBarIcon?.({ focused, color, size: 24 })}
            </Pressable>
          </View>
        );
      })}

      <MotiView
        style={{
          position: "absolute",
          top: 0,
          height: 2,
          backgroundColor: color,
          width: width / state.routes.length,
        }}
        animate={{
          translateX: (width / state.routes.length) * state.index,
        }}
        transition={{ type: "timing", duration: 250 }}
      />
    </View>
  );
};

export const BottomTabbar = ({ state, ...rest }: BottomTabBarProps) => {
  const { isTabBarHidden } = useNavigationElements();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const nativeBottomTabBarHeightCallback = useBottomTabBarHeightCallback();
  const isHiddenBottomTabbar = isTabBarHidden;
  const isDark = useIsDarkMode();

  const overlayColor = isDark ? "rgba(0,0,0,.1)" : "rgba(255, 255, 255, 0.8)";
  const blurType = isDark ? "dark" : "light";

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: isHiddenBottomTabbar
          ? 0
          : BOTTOM_TABBAR_BASE_HEIGHT + safeAreaBottom,
        overflow: "hidden",
        backgroundColor: Platform.select({
          ios: isDark ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.8)",
          default: isDark ? "rgba(0,0,0,1)" : "rgba(255, 255, 255, 1)",
        }),
      }}
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        nativeBottomTabBarHeightCallback(height);
      }}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          blurRadius={20}
          overlayColor={overlayColor}
          blurType={blurType}
          blurAmount={100}
          style={[StyleSheet.absoluteFillObject]}
        />
      ) : null}
      <ThemeBottomTabbar state={state} {...rest} />
    </View>
  );
};

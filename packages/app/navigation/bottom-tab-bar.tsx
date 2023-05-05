import { StyleSheet, useWindowDimensions } from "react-native";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MotiView } from "moti";

import { Haptics } from "@showtime-xyz/universal.haptics";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useRedirectToScreen } from "app/hooks/use-redirect-to-screen";
import { useUser } from "app/hooks/use-user";
import { BlurView } from "app/lib/blurview";
import { BOTTOM_TABBAR_BASE_HEIGHT } from "app/lib/constants";
import { useBottomTabBarHeightCallback } from "app/lib/react-navigation/bottom-tabs";

import { CreateTabBarIcon } from "./tab-bar-icons";
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

  const redirectToCreateDrop = useRedirectToCreateDrop();
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
          Haptics.impactAsync();

          if (route.name === "createTab") {
            redirectToCreateDrop();
            return;
          }

          if (!focused && !event.defaultPrevented) {
            if (
              (route.name === "notificationsTab" ||
                route.name === "profileTab") &&
              !isAuthenticated
            ) {
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
            <Pressable tw="flex-1" onLongPress={onLongPress} onPress={onPress}>
              {options.tabBarButton && (
                <CreateTabBarIcon
                  color={isDark ? "#000" : "#fff"}
                  style={{ backgroundColor: isDark ? "#fff" : "#000" }}
                />
              )}
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

  const overlayColor = isDark ? "rgba(0,0,0,.8)" : "rgba(255, 255, 255, 0.8)";
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
        backgroundColor: "transparent",
      }}
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => {
        nativeBottomTabBarHeightCallback(height);
      }}
    >
      <BlurView
        blurRadius={20}
        overlayColor={overlayColor}
        blurType={blurType}
        blurAmount={100}
        style={[StyleSheet.absoluteFillObject]}
      />
      <ThemeBottomTabbar state={state} {...rest} />
    </View>
  );
};

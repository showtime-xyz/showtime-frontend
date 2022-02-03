import { useWindowDimensions, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tw } from "design-system/tailwind";
import { useNavigationElements } from "./use-navigation-elements";
import { NextNavigationProps } from "./types";
import { createNextTabNavigator } from "./universal-tab-navigator";
import {
  HomeTabBarIcon,
  TrendingTabBarIcon,
  CameraTabBarIcon,
  MarketplaceTabBarIcon,
  NotificationsTabBarIcon,
} from "./tab-bar-icons";
import { useIsDarkMode } from "design-system/hooks";
import { View } from "design-system";

const HomeNavigator = dynamic(() => import("../pages/home"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const CameraNavigator = dynamic(() => import("../pages/camera"));
const MarketplaceNavigator = dynamic(() => import("../pages/marketplace"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));

const BottomTab = createNextTabNavigator();

export function NextTabNavigator({
  pageProps,
  Component,
}: NextNavigationProps) {
  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeAreaInsets();

  const color = tw.style("bg-black dark:bg-white")?.backgroundColor as string;
  const tint = color === "#000" ? "light" : "dark";
  const isDark = useIsDarkMode();

  return (
    <BottomTab.Navigator
      initialRouteName="homeTab"
      screenOptions={{
        lazy: Platform.OS === "android" ? false : true,
        headerShown: false,
        tabBarActiveTintColor: color,
        tabBarInactiveTintColor: color,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            // backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(228, 228, 231, 0.95)',
            height: 64 + safeAreaBottom,
            backgroundColor: "transparent",
            borderTopColor: "transparent",
            position: "absolute",
          },
          width >= 768 && {
            backgroundColor: "transparent",
            borderTopColor: "transparent",
            top: 0,
            left: width / 2 - 100,
            maxWidth: 200,
          },
          isTabBarHidden && {
            display: "none",
            bottom: -100,
          },
        ],
        tabBarBackground: () =>
          width >= 768 ? null : (
            <>
              {Platform.OS === "android" ? (
                <View
                  tw="bg-white dark:bg-black opacity-95"
                  style={StyleSheet.absoluteFill}
                />
              ) : (
                <BlurView
                  tint={tint}
                  intensity={95}
                  style={StyleSheet.absoluteFill}
                />
              )}
            </>
          ),
      }}
      Component={Component}
      pageProps={pageProps}
    >
      <BottomTab.Screen
        name="homeTab"
        component={HomeNavigator}
        options={{
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <BottomTab.Screen
        name="trendingTab"
        component={TrendingNavigator}
        options={{
          tabBarIcon: TrendingTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="cameraTab"
          component={CameraNavigator}
          options={{
            tabBarIcon: CameraTabBarIcon,
            headerShown: false,
          }}
        />
      )}
      <BottomTab.Screen
        name="marketplaceTab"
        component={MarketplaceNavigator}
        options={{
          tabBarIcon: MarketplaceTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="notificationsTab"
          component={NotificationsNavigator}
          options={{
            tabBarIcon: NotificationsTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}

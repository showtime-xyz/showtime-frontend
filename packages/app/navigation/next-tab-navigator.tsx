import { useWindowDimensions, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tw } from "design-system/tailwind";
import { Header } from "app/components/header";
import { useNavigationElements } from "./use-navigation-elements";
import { NextNavigationProps } from "./types";
import { createNextTabNavigator } from "./universal-tab-navigator";
import {
  HomeTabBarIcon,
  DiscoverTabBarIcon,
  CameraTabBarIcon,
  TrendingTabBarIcon,
  NotificationsTabBarIcon,
} from "./tab-bar-icons";

const HomeNavigator = dynamic(() => import("../pages/home"));
const DiscoverNavigator = dynamic(() => import("../pages/discover"));
const CameraNavigator = dynamic(() => import("../pages/camera"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));

const BottomTab = createNextTabNavigator();

export function NextTabNavigator({
  pageProps,
  Component,
}: NextNavigationProps) {
  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const color = tw.style("bg-black dark:bg-white")?.backgroundColor as string;
  const tint = color === "#000" ? "light" : "dark";

  return (
    <BottomTab.Navigator
      initialRouteName="homeTab"
      screenOptions={{
        header: () => <Header />,
        headerShown: true,
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
            <BlurView
              tint={tint}
              intensity={95}
              style={StyleSheet.absoluteFill}
            />
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
        name="discoverTab"
        component={DiscoverNavigator}
        options={{
          tabBarIcon: DiscoverTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="cameraTab"
          component={CameraNavigator}
          options={{
            tabBarIcon: CameraTabBarIcon,
          }}
        />
      )}
      <BottomTab.Screen
        name="trendingTab"
        component={TrendingNavigator}
        options={{
          tabBarIcon: TrendingTabBarIcon,
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

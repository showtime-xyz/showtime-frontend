import { useWindowDimensions, useColorScheme, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import dynamic from "next/dynamic";

import { Header } from "app/components/header";
import { useNavigationElements } from "./use-navigation-elements";
import { NextNavigationProps } from "./types";
import { createNextTabNavigator } from "./universal-tab-navigator";
import {
  HomeTabBarIcon,
  DiscoverTabBarIcon,
  TrendingTabBarIcon,
  NotificationsTabBarIcon,
} from "./tab-bar-icons";

const HomeNavigator = dynamic(() => import("../pages/home"));
const DiscoverNavigator = dynamic(() => import("../pages/discover"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));

const BottomTab = createNextTabNavigator();

export function NextTabNavigator({
  pageProps,
  Component,
}: NextNavigationProps) {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { isTabBarHidden } = useNavigationElements();

  return (
    <BottomTab.Navigator
      initialRouteName="homeTab"
      screenOptions={{
        header: () => <Header />,
        headerShown: true,
        tabBarActiveTintColor: isDark ? "#fff" : "#000",
        tabBarInactiveTintColor: isDark ? "#fff" : "#000",
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            // backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(228, 228, 231, 0.95)',
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
              tint={isDark ? "dark" : "light"}
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

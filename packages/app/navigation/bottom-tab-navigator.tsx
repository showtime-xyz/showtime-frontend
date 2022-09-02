import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import dynamic from "next/dynamic";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useExpoUpdate } from "app/hooks/use-expo-update";
import { useUser } from "app/hooks/use-user";

import { TabBarButton } from "./tab-bar-button";
import {
  CreateTabBarIcon,
  HomeTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
  TrendingTabBarIcon,
} from "./tab-bar-icons";
import { useNavigationElements } from "./use-navigation-elements";

const HomeNavigator = dynamic(() => import("../pages/home"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const CreateNavigator = dynamic(() => import("../pages/create"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));
const ProfileNavigator = dynamic(() => import("../pages/profile"));

const BottomTab = createBottomTabNavigator();

export function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();
  const { isAuthenticated, user } = useUser();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const color = tw.style("bg-black dark:bg-white")?.backgroundColor as string;
  const tint = color === "#000" ? "light" : "dark";
  useExpoUpdate();
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
          (!isAuthenticated || isTabBarHidden) && {
            bottom: -100,
          },
        ],
        tabBarBackground: () =>
          width >= 768 ? null : (
            // <BlurredBackground isDark={isDark} width={width} height={50} />
            <>
              {Platform.OS === "android" ? (
                <View
                  tw="bg-white opacity-95 dark:bg-black"
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
    >
      <BottomTab.Screen
        name="homeTab"
        component={HomeNavigator}
        options={{
          tabBarButton: TabBarButton,
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <BottomTab.Screen
        name="trendingTab"
        component={TrendingNavigator}
        options={{
          tabBarButton: TabBarButton,
          tabBarIcon: TrendingTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="createTab"
          component={CreateNavigator}
          options={{
            tabBarButton: TabBarButton,
            tabBarIcon: CreateTabBarIcon,
            // headerShown: false,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="notificationsTab"
          component={NotificationsNavigator}
          options={{
            tabBarButton: TabBarButton,
            tabBarIcon: NotificationsTabBarIcon,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="profileTab"
          component={ProfileNavigator}
          navigationKey={user?.data?.profile?.profile_id?.toString()}
          options={{
            tabBarButton: TabBarButton,
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}

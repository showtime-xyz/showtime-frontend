import { useEffect } from "react";
import { Alert, Platform, StyleSheet, useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Updates from "expo-updates";
import dynamic from "next/dynamic";

import { useIsForeground } from "app/hooks/use-is-foreground";
import { useUser } from "app/hooks/use-user";
import { useSafeAreaInsets } from "app/lib/safe-area";

import { View } from "design-system";
import { tw } from "design-system/tailwind";

import { TabBarButton } from "./tab-bar-button";
import {
  CameraTabBarIcon,
  HomeTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
  TrendingTabBarIcon,
} from "./tab-bar-icons";
import { useNavigationElements } from "./use-navigation-elements";

const HomeNavigator = dynamic(() => import("../pages/home"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const CameraNavigator = dynamic(() => import("../pages/camera"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));
const ProfileNavigator = dynamic(() => import("../pages/profile"));

const BottomTab = createBottomTabNavigator();

export function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { isAuthenticated } = useUser();
  const isForeground = useIsForeground();

  const color = tw.style("bg-black dark:bg-white")?.backgroundColor as string;
  const tint = color === "#000" ? "light" : "dark";

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();

          // TODO: use Snackbar instead?
          Alert.alert(
            "New update available 🎉",
            "Press 'Reload' to update the app.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Reload",
                style: "default",
                onPress: () => Updates.reloadAsync(),
              },
            ]
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (Platform.OS === "ios" && !isForeground) {
      checkUpdate();
    }
  }, [isForeground]);

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
          name="cameraTab"
          component={CameraNavigator}
          options={{
            tabBarButton: TabBarButton,
            tabBarIcon: CameraTabBarIcon,
            headerShown: false,
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
          options={{
            tabBarButton: TabBarButton,
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}

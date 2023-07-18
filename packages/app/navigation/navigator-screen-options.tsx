import { Platform } from "react-native";

import { HeaderLeft } from "app/components/header";

export const screenOptions = ({
  safeAreaTop,
  isDark,
  headerLeft = null,
  headerRight = null,
  headerCenter = "",
}: {
  safeAreaTop: number;
  isDark: boolean;
  headerLeft?: any;
  headerRight?: any;
  headerCenter?: any;
}) =>
  ({
    animationEnabled: true,
    headerShown: true,
    headerLeft: headerLeft ?? HeaderLeft,
    headerTitle: headerCenter,
    headerTitleStyle: { fontSize: 16, fontWeight: "700" },
    headerTitleAlign: "center" as "center",
    headerRight: headerRight,
    headerTintColor: isDark ? "#fff" : "#000",
    headerTransparent: Platform.OS === "android" ? false : true,
    headerBlurEffect: isDark ? "dark" : "light",
    headerBackVisible: false,
    headerBackTitleVisible: false,
    headerShadowVisible: false,
    fullScreenGestureEnabled: true,
    animation: Platform.OS === "android" ? "fade_from_bottom" : "simple_push",
    animationDuration: Platform.OS === "ios" ? 400 : undefined,
    statusBarStyle: isDark ? "light" : "dark",
    statusBarAnimation: "fade",

    // @ts-ignore
    headerStyle: {
      height: 64 + safeAreaTop,
      // Similar to `headerShadowVisible` but for web
      // @ts-ignore
      borderBottomWidth: 0,
      backgroundColor: Platform.select({
        android: isDark ? "black" : "white",
        default: isDark ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.8)",
      }),
    },
    cardStyle: { flex: 1, backgroundColor: "transparent" },
    cardOverlayEnabled: false,
  } as {});

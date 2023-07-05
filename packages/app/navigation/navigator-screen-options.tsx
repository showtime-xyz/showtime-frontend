import { Platform } from "react-native";

import { HeaderLeft } from "app/components/header";
import { HeaderSearch } from "app/components/header/header-search";

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
    headerTitleAlign: "center" as "center",
    headerRight: headerRight,
    headerTintColor: isDark ? "#fff" : "#000",
    headerTransparent: Platform.OS === "android" ? false : true,
    headerBlurEffect: isDark ? "dark" : "light",
    headerBackVisible: false,
    headerBackTitleVisible: false,
    headerShadowVisible: false,
    fullScreenGestureEnabled: true,
    animationDuration: 400,
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

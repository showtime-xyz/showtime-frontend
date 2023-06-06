import { Platform } from "react-native";

import { HeaderLeft } from "app/components/header";
import HeaderCenter from "app/components/header/header-center";

export const screenOptions = ({
  safeAreaTop,
  isDark,
  headerLeft = null,
  headerRight = null,
}: {
  safeAreaTop: number;
  isDark: boolean;
  headerLeft?: any;
  headerRight?: any;
}) =>
  ({
    animationEnabled: true,
    headerShown: true,
    headerLeft: headerLeft ?? HeaderLeft,
    headerTitle: HeaderCenter,
    headerTitleAlign: "center" as "center",
    headerRight: headerRight ?? null,
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
      backgroundColor:
        Platform.OS === "android" && isDark
          ? "black"
          : Platform.OS === "android" && !isDark
          ? "white"
          : "transparent",
    },
    cardStyle: { flex: 1, backgroundColor: "transparent" },
    cardOverlayEnabled: false,
  } as {});

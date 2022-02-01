import { HeaderLeft, HeaderCenter, HeaderRight } from "app/components/header";

export const navigatorScreenOptions = ({
  safeAreaTop,
  isDark,
}: {
  safeAreaTop: number;
  isDark: boolean;
}) => ({
  animationEnabled: true,
  headerShown: true,
  headerLeft: HeaderLeft,
  headerTitle: HeaderCenter,
  headerTitleAlign: "center",
  headerRight: HeaderRight,
  headerTintColor: "#000",
  // headerTransparent: true,
  // headerBlurEffect: "dark",
  headerBackVisible: false,
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  // @ts-ignore
  headerStyle: {
    height: 64 + safeAreaTop,
    backgroundColor: isDark ? "black" : "white",
    // Similar to `headerShadowVisible` but for web
    // @ts-ignore
    borderBottomWidth: 0,
  },
  cardStyle: { flex: 1, backgroundColor: "transparent" },
  cardOverlayEnabled: false,
});

import { Platform } from "react-native";
import { HeaderBackButtonProps } from "@react-navigation/elements";

import { HeaderBackButton } from "app/navigation/header-back-button";
import { fontFamily } from "design-system/typography";

export const navigatorScreenOptions = {
  animationEnabled: true,
  headerShown: false,
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  headerTitleStyle: {
    fontFamily: fontFamily("Inter-Black"),
  },
  headerStyle: {
    // Similar to `headerShadowVisible` but for web
    // @ts-ignore
    borderBottomWidth: 0,
  },
  headerLeft: Platform.select({
    web(props: HeaderBackButtonProps) {
      return <HeaderBackButton {...props} />;
    },
  }),
  cardStyle: { flex: 1, backgroundColor: "transparent" },
};

import { useWindowDimensions } from "react-native";

import {
  useBlurredBackgroundStyles,
  useIsDarkMode,
} from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import {
  CreateTabBarIcon,
  HomeTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
  TrendingTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { WebFooter } from "./links-footer.web";

const Footer = () => {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const color = isDark ? "white" : "black";
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useUser();
  const blurredBackgroundStyles = useBlurredBackgroundStyles(95);
  const { isTabBarHidden } = useNavigationElements();

  if (width >= 768) {
    return <WebFooter />;
  }

  if (!isAuthenticated || isTabBarHidden) {
    return null;
  }

  return (
    <View
      // @ts-expect-error
      style={{
        position: "fixed",
        ...blurredBackgroundStyles,
      }}
      tw="bottom-0 right-0 left-0 z-50 h-16 flex-row items-center justify-between px-4 py-2"
    >
      <HomeTabBarIcon
        color={color}
        focused={router.pathname === "/" || router.pathname === "/home"}
      />
      <TrendingTabBarIcon
        color={color}
        focused={router.pathname === "/trending"}
      />
      <CreateTabBarIcon color={color} focused={router.pathname === "/drop"} />
      <NotificationsTabBarIcon
        color={color}
        focused={router.pathname === "/notifications"}
      />
      <ProfileTabBarIcon />
    </View>
  );
};

export { Footer };

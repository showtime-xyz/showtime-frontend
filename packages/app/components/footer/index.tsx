import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import { useUser } from "app/hooks/use-user";
import { HIDE_LINK_FOOTER_ROUTER_LIST } from "app/lib/constants";
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
  const { isTabBarHidden } = useNavigationElements();

  if (width >= 768) {
    return <WebFooter />;
  }

  if (
    !isAuthenticated ||
    isTabBarHidden ||
    HIDE_LINK_FOOTER_ROUTER_LIST.includes(router.pathname)
  ) {
    return null;
  }

  return (
    <View
      style={{
        height: MOBILE_WEB_TABS_HEIGHT,
      }}
      tw="safe-bottom fixed bottom-0 right-0 left-0 z-50 h-12 flex-row items-center justify-between px-4 backdrop-blur-md"
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

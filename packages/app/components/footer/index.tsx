import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import { SWIPE_LIST_SCREENS } from "app/lib/constants";
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
  const isDarkThemePage = SWIPE_LIST_SCREENS.includes(router.pathname);
  const color = isDark ? "#fff" : isDarkThemePage ? "#fff" : "#000";
  const buttonColor = isDark ? "#000" : isDarkThemePage ? "#000" : "#fff";
  const buttonBackgroundColor = isDark
    ? "#fff"
    : SWIPE_LIST_SCREENS.includes(router.pathname)
    ? "#fff"
    : "#000";

  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();

  if (width >= 768) {
    return <WebFooter />;
  }

  if (isTabBarHidden) {
    return null;
  }

  return (
    <View
      style={{
        height: MOBILE_WEB_TABS_HEIGHT,
      }}
      tw="safe-bottom fixed bottom-0 left-0 right-0 z-50 h-12 flex-row items-center justify-between px-4 backdrop-blur-md"
    >
      <HomeTabBarIcon
        color={color}
        focused={router.pathname === "/" || router.pathname === "/trending"}
      />
      <TrendingTabBarIcon
        color={color}
        focused={router.pathname === "/home" || router.pathname === "/foryou"}
      />
      <CreateTabBarIcon
        color={buttonColor}
        focused={router.pathname === "/drop"}
        style={{ backgroundColor: buttonBackgroundColor }}
      />
      <NotificationsTabBarIcon
        color={color}
        focused={router.pathname === "/notifications"}
      />
      <ProfileTabBarIcon color={color} />
    </View>
  );
};

export default Footer;

import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import {
  HIDE_MOBILE_WEB_FOOTER_SCREENS,
  SWIPE_LIST_SCREENS,
} from "app/lib/constants";
import {
  CreatorChannelsTabBarIcon,
  HomeTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

const Footer = () => {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const isDarkThemePage = SWIPE_LIST_SCREENS.includes(router.pathname);
  const color = isDark ? "#fff" : isDarkThemePage ? "#fff" : "#000";

  const { width } = useWindowDimensions();
  const { isTabBarHidden } = useNavigationElements();

  if (width >= 768) {
    return null;
  }

  if (isTabBarHidden) {
    return null;
  }
  if (HIDE_MOBILE_WEB_FOOTER_SCREENS.includes(router.pathname)) {
    return null;
  }

  return (
    <View
      style={{
        height: `calc(${MOBILE_WEB_TABS_HEIGHT}px + env(safe-area-inset-bottom))`,
        backgroundColor: SWIPE_LIST_SCREENS.includes(router.pathname)
          ? "rgba(0,0,0,.7)"
          : undefined,
        // @ts-ignore
        boxShadow: SWIPE_LIST_SCREENS.includes(router.pathname)
          ? "rgba(255, 255, 255, 0.5) 0px 6px 10px"
          : isDark
          ? "rgba(255, 255, 255, 0.5) 0px 6px 10px"
          : "rgba(0, 0, 0, 0.2) 0px 6px 10px",
      }}
      tw="safe-bottom fixed bottom-0 left-0 right-0 z-50 h-12 flex-row items-center justify-between bg-white/80 px-4 pt-1 backdrop-blur-md dark:bg-black/70"
    >
      <HomeTabBarIcon color={color} focused={router.pathname === "/"} />
      <CreatorChannelsTabBarIcon
        color={color}
        focused={router.pathname === "/channels"}
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

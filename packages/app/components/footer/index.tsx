import { useWindowDimensions } from "react-native";

import { useUser } from "app/hooks/use-user";
import {
  HomeTabBarIcon,
  TrendingTabBarIcon,
  CameraTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";
import { useRouter } from "app/navigation/use-router";

import { useBlurredBackgroundColor } from "design-system/hooks";
import { useIsDarkMode } from "design-system/hooks";
import { View } from "design-system/view";

import { WebFooter } from "./links-footer.web";

const Footer = () => {
  const router = useRouter();
  const isDark = useIsDarkMode();
  const color = isDark ? "white" : "black";
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useUser();
  const blurredBackgroundColor = useBlurredBackgroundColor(95);
  const { isTabBarHidden } = useNavigationElements();

  // Todo: on small screens, only 'marketing' page display this.
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
        backdropFilter: "blur(20px)",
        backgroundColor: blurredBackgroundColor,
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
      <CameraTabBarIcon color={color} focused={router.pathname === "/camera"} />
      <NotificationsTabBarIcon
        color={color}
        focused={router.pathname === "/notifications"}
      />
      <ProfileTabBarIcon />
    </View>
  );
};

export { Footer };

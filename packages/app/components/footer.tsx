import { useWindowDimensions } from "react-native";

import { useUser } from "app/hooks/use-user";
import {
  HomeTabBarIcon,
  TrendingTabBarIcon,
  CameraTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useRouter } from "app/navigation/use-router";

import { View } from "design-system/view";

const Footer = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useUser();

  if (width >= 768) {
    // TODO: "web" desktop footer
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View
      // @ts-expect-error
      style={{ position: "fixed", backdropFilter: "blur(20px)" }}
      tw="bottom-0 right-0 left-0 z-50 h-16 flex-row items-center justify-between px-4 py-2"
    >
      <HomeTabBarIcon
        color="black"
        focused={router.pathname === "/" || router.pathname === "/home"}
      />
      <TrendingTabBarIcon
        color="black"
        focused={router.pathname === "/trending"}
      />
      <CameraTabBarIcon color="black" focused={router.pathname === "/camera"} />
      <NotificationsTabBarIcon
        color="black"
        focused={router.pathname === "/notifications"}
      />
      <ProfileTabBarIcon />
    </View>
  );
};

export { Footer };

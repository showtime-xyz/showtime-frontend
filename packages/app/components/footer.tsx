import { useWindowDimensions } from "react-native";

import {
  HomeTabBarIcon,
  TrendingTabBarIcon,
  CameraTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
} from "app/navigation/tab-bar-icons";

import { View } from "design-system/view";

const Footer = () => {
  const { width } = useWindowDimensions();

  if (width >= 768) {
    // TODO: "web" desktop footer
    return null;
  }

  return (
    <View
      style={{ position: "sticky", backdropFilter: "blur(20px)" }}
      tw="bottom-0 right-0 left-0 z-50 h-16 flex-row items-center justify-between px-4 py-2"
    >
      <HomeTabBarIcon color="black" focused={true} />
      <TrendingTabBarIcon color="black" focused={false} />
      <CameraTabBarIcon color="black" focused={false} />
      <NotificationsTabBarIcon color="black" focused={false} />
      <ProfileTabBarIcon />
    </View>
  );
};

export { Footer };

import { Suspense } from "react";
import { Platform } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useNotifications } from "app/hooks/use-notifications";
import { useUser } from "app/hooks/use-user";
import { Link } from "app/navigation/link";

import { Avatar } from "design-system/avatar";
import {
  Home,
  HomeFilled,
  Compass,
  CompassFilled,
  Hot,
  HotFilled,
  Bell,
  BellFilled,
  Plus,
} from "design-system/icon";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

type TabBarIconProps = {
  color: string;
  focused: boolean;
};

function TabBarIcon({
  tab,
  children,
}: {
  tab: string;
  children: React.ReactNode;
}) {
  if (Platform.OS === "web") {
    return (
      <Link href={tab}>
        <View tw="w-12 h-12 items-center justify-center">{children}</View>
      </Link>
    );
  }

  return <View tw="w-12 h-12 items-center justify-center">{children}</View>;
}

export const HomeTabBarIcon = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/">
      {focused ? (
        <HomeFilled
          style={tw.style("z-1")}
          width={24}
          height={24}
          color={color}
        />
      ) : (
        <Home style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const MarketplaceTabBarIcon = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/marketplace">
      {focused ? (
        <CompassFilled
          style={tw.style("z-1")}
          width={24}
          height={24}
          color={color}
        />
      ) : (
        <Compass style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const CameraTabBarIcon = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/camera">
      <View
        tw={[
          "rounded-full h-12 w-12 justify-center items-center",
          focused ? "bg-gray-100 dark:bg-gray-900" : "bg-black dark:bg-white",
        ]}
      >
        <Plus
          width={24}
          height={24}
          color={
            tw.style(
              focused ? "bg-black dark:bg-white" : "bg-white dark:bg-black"
            )?.backgroundColor as string
          }
        />
      </View>
    </TabBarIcon>
  );
};

export const TrendingTabBarIcon = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/trending">
      {focused ? (
        <HotFilled
          style={tw.style("z-1")}
          width={24}
          height={24}
          color={color}
        />
      ) : (
        <Hot style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const NotificationsTabBarIcon = ({
  color,
  focused,
}: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/notifications">
      {focused ? (
        <BellFilled
          style={tw.style("z-1")}
          width={24}
          height={24}
          color={color}
        />
      ) : (
        <Bell style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
      {/* <ErrorBoundary>
        <Suspense fallback={null}>
          <UnreadNotificationIndicator />
        </Suspense>
      </ErrorBoundary> */}
    </TabBarIcon>
  );
};

// const UnreadNotificationIndicator = () => {
//   const { hasUnreadNotification } = useNotifications();

//   return hasUnreadNotification ? (
//     <View tw="w-2 h-2 absolute rounded-full top-2 right-2 bg-amber-500 dark:bg-violet-500" />
//   ) : null;
// };

export const ProfileTabBarIcon = () => {
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();

  return (
    <TabBarIcon tab={`/@${user?.data?.profile?.username ?? userAddress}`}>
      <View tw="h-8 w-8 items-center justify-center rounded-full">
        <Avatar url={user?.data?.profile?.img_url} />
      </View>
    </TabBarIcon>
  );
};

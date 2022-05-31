import { Platform, useWindowDimensions } from "react-native";

import { tw } from "@showtime-xyz/universal.tailwind";
import { TW } from "@showtime-xyz/universal.tailwind/types";
import { View } from "@showtime-xyz/universal.view";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { Link } from "app/navigation/link";

import { Avatar } from "design-system/avatar";
import {
  Bell,
  BellFilled,
  Compass,
  CompassFilled,
  Home,
  HomeFilled,
  Hot,
  HotFilled,
  Plus,
  Showtime,
} from "design-system/icon";
import { breakpoints } from "design-system/theme";

type TabBarIconProps = {
  color?: string;
  focused?: boolean;
  customTw?: TW;
};
type TabBarButtonProps = {
  tab: string;
  children: React.ReactNode;
  customTw?: TW;
};

function TabBarIcon({ tab, children, customTw }: TabBarButtonProps) {
  const isWeb = Platform.OS === "web";
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  if (isWeb) {
    return (
      <Link href={tab}>
        <View
          tw="h-12 w-12 items-center justify-center rounded-full"
          style={tw.style(
            `${
              isWeb && isMdWidth ? "bg-gray-100 dark:bg-gray-900" : ""
            } ${customTw}`
          )}
        >
          {children}
        </View>
      </Link>
    );
  }

  return <View tw="h-12 w-12 items-center justify-center">{children}</View>;
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

export const ShowtimeTabBarIcon = ({ customTw }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/" customTw={customTw}>
      <Showtime
        style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
        color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
        width={24}
        height={24}
      />
    </TabBarIcon>
  );
};

export const CameraTabBarIcon = ({ focused }: TabBarIconProps) => {
  const { width } = useWindowDimensions();

  return (
    <TabBarIcon
      tab={Platform.select({
        default: "/camera",
        web: width >= breakpoints["md"] ? "/create" : "/camera",
      })}
    >
      <View
        tw={[
          "h-12 w-12 items-center justify-center rounded-full",
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

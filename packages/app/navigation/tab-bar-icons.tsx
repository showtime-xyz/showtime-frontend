import { Suspense, useState, useEffect, useRef } from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";

import { MMKV } from "react-native-mmkv";
import * as Tooltip from "universal-tooltip";
import type { ContentProps } from "universal-tooltip";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Bell,
  BellFilled,
  CreatorChannel,
  CreatorChannelFilled,
  Home,
  HomeFilled,
  Hot,
  HotFilled,
  Plus,
  Showtime,
  User,
} from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { TW, colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useNotifications } from "app/hooks/use-notifications";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useRedirectToScreen } from "app/hooks/use-redirect-to-screen";
import { useUser } from "app/hooks/use-user";
import { Link } from "app/navigation/link";

const store = new MMKV();
const STORE_KEY = "showCreatorChannelTip";

type TabBarIconProps = {
  color?: string;
  focused?: boolean;
  tw?: TW;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

type TabBarButtonProps = {
  tab?: string;
  children: React.ReactNode;
  tw?: TW;
  onPress?: () => void;
};

function TabBarIcon({ tab, children, tw, onPress }: TabBarButtonProps) {
  if (Platform.OS === "web") {
    if (onPress) {
      return (
        <PressableHover
          onPress={onPress}
          tw={[
            "h-12 w-12 items-center justify-center rounded-full md:bg-gray-100 md:dark:bg-gray-900",
            tw ?? "",
          ]}
        >
          {children}
        </PressableHover>
      );
    }
    if (!tab) return null;
    return (
      <Link href={tab}>
        <View
          tw={[
            "h-12 w-12 items-center justify-center rounded-full md:bg-gray-100 md:dark:bg-gray-900",
            tw ?? "",
          ]}
        >
          {children}
        </View>
      </Link>
    );
  }

  return <View tw="h-12 w-14 items-center justify-center">{children}</View>;
}

export const HomeTabBarIcon = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/">
      {focused ? (
        <HomeFilled
          style={{ zIndex: 1 }}
          width={24}
          height={24}
          color={color}
        />
      ) : (
        <Home style={{ zIndex: 1 }} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const ShowtimeTabBarIcon = ({ tw }: TabBarIconProps) => {
  const isDark = useIsDarkMode();
  return (
    <TabBarIcon tab="/" tw={tw}>
      <Showtime
        style={{ borderRadius: 8, overflow: "hidden", width: 24, height: 24 }}
        color={isDark ? "#FFF" : "#000"}
        width={24}
        height={24}
      />
    </TabBarIcon>
  );
};

export const CreateTabBarIcon = ({
  color,
  tw = "",
  style,
}: TabBarIconProps) => {
  const redirectToCreateDrop = useRedirectToCreateDrop();

  return (
    <TabBarIcon onPress={redirectToCreateDrop}>
      <View
        tw={[
          "web:h-10 web:w-10 h-12 w-12 items-center justify-center rounded-full",
          "bg-black dark:bg-white",
          tw,
        ]}
        style={style}
      >
        <Plus width={24} height={24} color={color} />
      </View>
    </TabBarIcon>
  );
};

export const CreatorChannelsTabBarIcon = ({
  color,
  focused,
  tooltipSide = "top",
}: TabBarIconProps & {
  tooltipSide?: ContentProps["side"];
}) => {
  const router = useRouter();
  const [showTip, setShowTip] = useState(false);
  const [open, setOpen] = useState(true);
  const [badgeNumber, setBadgeNumber] = useState(12);
  const isSet = useRef(false);

  const onDismiss = () => {
    store.set(STORE_KEY, true);
    isSet.current = true;
    setShowTip(false);
  };
  useEffect(() => {
    if (!store.getBoolean(STORE_KEY) && !isSet.current) {
      setTimeout(() => {
        setShowTip(true);
        isSet.current = true;
      }, 2000);
    }
    if (focused) {
      setOpen(false);
    }
  }, [focused]);

  if (!showTip) {
    return (
      <TabBarIcon tab="/channels">
        {focused ? (
          <CreatorChannelFilled width={24} height={24} color={color} />
        ) : (
          <CreatorChannel width={24} height={24} color={color} />
        )}
        {badgeNumber > 0 && (
          <View tw="web:-top-0.5 absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-indigo-700">
            <Text tw="text-xs font-medium text-white">
              {badgeNumber > 99 ? "99" : badgeNumber}
            </Text>
          </View>
        )}
      </TabBarIcon>
    );
  }
  return (
    <TabBarIcon tab="/channels">
      <Tooltip.Root
        onDismiss={onDismiss}
        open={open}
        disableDismissWhenTouchOutside
        usePopover
      >
        <Tooltip.Trigger>
          <View tw="items-center justify-center">
            <View tw="w-14 flex-row items-center justify-center rounded-full bg-indigo-700 md:h-12 md:w-12">
              <CreatorChannel width={24} height={24} color="#fff" />
              {badgeNumber > 0 && (
                <Text tw="ml-1 text-sm font-medium text-white md:hidden">
                  {badgeNumber > 99 ? "99+" : badgeNumber}
                </Text>
              )}
            </View>
          </View>
        </Tooltip.Trigger>
        <Tooltip.Content
          sideOffset={3}
          containerStyle={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 6,
            paddingBottom: 6,
          }}
          className="web:outline-none"
          side={tooltipSide}
          presetAnimation="fadeIn"
          backgroundColor={colors.indigo[700]}
          borderRadius={12}
          onTap={() => {
            router.push("/channels");
            if (Platform.OS === "web") {
              onDismiss();
            }
          }}
          dismissDuration={500}
          maxWidth={200}
        >
          <Tooltip.Text
            textSize={14}
            textColor="#fff"
            text={"Check out new broadcasts from your creators"}
          />
        </Tooltip.Content>
      </Tooltip.Root>
    </TabBarIcon>
  );
};

export const TrendingTabBarIcon = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/foryou">
      {focused ? (
        <HotFilled style={{ zIndex: 1 }} width={24} height={24} color={color} />
      ) : (
        <Hot style={{ zIndex: 1 }} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};
// This icon is temporary until we have creator channel feature
export const HotTabBarIconTemp = ({ color, focused }: TabBarIconProps) => {
  return (
    <TabBarIcon tab="/foryou">
      {focused ? (
        <HotFilled style={{ zIndex: 1 }} width={24} height={24} color={color} />
      ) : (
        <Hot style={{ zIndex: 1 }} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const NotificationsTabBarIcon = ({
  color,
  focused,
  onPress,
}: TabBarIconProps) => {
  const redirectToScreen = useRedirectToScreen();
  return (
    <TabBarIcon
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          redirectToScreen({
            pathname: "/notifications",
          });
        }
      }}
    >
      {focused ? (
        <BellFilled
          style={{ zIndex: 1 }}
          width={24}
          height={24}
          color={color}
        />
      ) : (
        <Bell style={{ zIndex: 1 }} width={24} height={24} color={color} />
      )}
      <ErrorBoundary renderFallback={() => <></>}>
        <Suspense fallback={null}>
          <UnreadNotificationIndicator />
        </Suspense>
      </ErrorBoundary>
    </TabBarIcon>
  );
};

const UnreadNotificationIndicator = () => {
  const { hasUnreadNotification } = useNotifications();

  return (
    <View
      tw="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 dark:bg-violet-500"
      style={{ opacity: hasUnreadNotification ? 1 : 0 }}
    />
  );
};

export const ProfileTabBarIcon = ({ color }: TabBarIconProps) => {
  const { user, isAuthenticated } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const redirectToScreen = useRedirectToScreen();

  return (
    <TabBarIcon
      onPress={() =>
        redirectToScreen({
          pathname: `/@${user?.data?.profile?.username ?? userAddress}`,
        })
      }
    >
      {isAuthenticated ? (
        <Avatar
          url={user?.data?.profile?.img_url}
          size={28}
          alt={"Profile Avatar"}
        />
      ) : (
        <User color={color} width={24} height={24} />
      )}
    </TabBarIcon>
  );
};

import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import * as Popover from "@radix-ui/react-popover";
import dynamic from "next/dynamic";
import { SvgProps } from "react-native-svg";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { Divider } from "@showtime-xyz/universal.divider";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Bell,
  Home,
  Search,
  Showtime,
  ShowtimeBrand,
  Hot,
  User,
  Plus,
  PhonePortraitOutline,
  CreatorChannel,
  Settings,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabBarVertical } from "@showtime-xyz/universal.tab-view";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { Notifications } from "app/components/notifications";
import { WEB_HEADER_HEIGHT } from "app/constants/layout";
import { useFooter } from "app/hooks/use-footer";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useTabState } from "app/hooks/use-tab-state";
import { useUser } from "app/hooks/use-user";
import { Link, TextLink } from "app/navigation/link";
import { NotificationsTabBarIcon } from "app/navigation/tab-bar-icons";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { withColorScheme } from "../memo-with-theme";
import HeaderCenter from "./header-center";
import { HeaderRight } from "./header-right";

const NOTIFICATION_LIST_HEIGHT = "calc(50vh - 64px)";
export const NotificationsInHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isDark = useIsDarkMode();
  const prevPath = useRef(router.pathname);
  const prevQuery = useRef(router.query);

  useEffect(() => {
    if (
      Platform.OS === "web" &&
      isOpen &&
      (prevPath.current !== router.pathname ||
        prevQuery.current !== router.query)
    ) {
      setIsOpen(false);
    }
    prevPath.current = router.pathname;
    prevQuery.current = router.query;
  }, [router.pathname, isOpen, router.query]);

  return (
    <Popover.Root modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger />

      <Popover.Anchor>
        <NotificationsTabBarIcon
          color={isDark ? "white" : "black"}
          focused={router.pathname === "/notifications"}
          onPress={() => {
            setIsOpen(!isOpen);
          }}
        />
      </Popover.Anchor>

      <Popover.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={12}
      >
        <View
          tw="dark:shadow-light shadow-light z-50 w-[480px] overflow-hidden rounded-3xl bg-white dark:bg-black md:max-w-md"
          style={Platform.select({
            web: {
              height: NOTIFICATION_LIST_HEIGHT,
            },
            default: {},
          })}
        >
          <ErrorBoundary>
            <Suspense
              fallback={
                <View tw="p-4">
                  <Spinner />
                </View>
              }
            >
              <Notifications web_height={NOTIFICATION_LIST_HEIGHT} hideHeader />
            </Suspense>
          </ErrorBoundary>
        </View>
      </Popover.Content>
    </Popover.Root>
  );
};

export const HeaderMd = withColorScheme(
  ({ canGoBack }: { canGoBack: boolean }) => {
    const { isHeaderHidden } = useNavigationElements();
    const { user, isAuthenticated } = useUser();
    const redirectToCreateDrop = useRedirectToCreateDrop();
    const navigateToLogin = useNavigateToLogin();
    const { links, social } = useFooter();
    const isDark = useIsDarkMode();
    const router = useRouter();
    const iconColor = isDark ? "#fff" : "#000";

    const HOME_ROUTES = useMemo(
      () => [
        {
          title: "Home",
          key: "Home",
          icon: Home,
          pathname: "/",
          focused: router.pathname === "/",
        },
        {
          title: "Channels",
          key: "Channels",
          icon: CreatorChannel,
          pathname: "/channels",
          focused: router.pathname.includes("channels"),
        },
        {
          title: "Trending",
          key: "Trending",
          icon: Hot,
          pathname: "/trending",
          focused: router.pathname === "/trending",
        },
        {
          title: "Notifications",
          key: "Notifications",
          icon: Bell,
          pathname: "/notifications",
          focused: router.pathname === "/notifications",
        },
        {
          title: "Settings",
          key: "Settings",
          icon: Settings,
          pathname: "/settings",
          focused: router.pathname === "/settings",
        },
        {
          title: "Profile",
          key: "Profile",
          icon: (props: SvgProps) =>
            isAuthenticated ? (
              <Avatar
                url={user?.data?.profile?.img_url}
                size={28}
                alt={"Profile Avatar"}
              />
            ) : (
              <User {...props} />
            ),
          pathname: `@${user?.data?.profile.username}`,
          focused: router.asPath === `/@${user?.data?.profile.username}`,
        },
        {
          title: "Search",
          key: "Search",
          icon: Search,
          pathname: "/search",
        },
      ],
      [
        isAuthenticated,
        router.asPath,
        router.pathname,
        user?.data?.profile?.img_url,
        user?.data?.profile.username,
      ]
    );

    if (isHeaderHidden) {
      return null;
    }
    return (
      <View tw="fixed top-0 h-full bg-white pl-6 dark:bg-black">
        <View tw="h-full w-56">
          <View tw="flex-row items-center pt-8">
            <ShowtimeBrand
              color={iconColor}
              width={19 * (84 / 16)}
              height={19}
            />
          </View>
          <View tw="-ml-4 mt-5 w-44 justify-center">
            {HOME_ROUTES.map((item, index) => (
              <Link
                tw="mt-2 flex-row items-center rounded-2xl py-3.5 pl-4 transition-all hover:bg-gray-50 hover:dark:bg-gray-900"
                key={item.key}
                href={item.pathname}
              >
                {item.icon({
                  color: iconColor,
                  width: 24,
                  height: 24,
                })}
                <Text
                  tw={[
                    "ml-4 text-lg text-black duration-300 dark:text-white",
                    item.focused ? "font-bold" : "font-normal",
                  ]}
                >
                  {item.title}
                </Text>
              </Link>
            ))}
          </View>
          <View tw="w-40">
            {!isAuthenticated && (
              <Button size="regular" tw="mt-6" onPress={navigateToLogin}>
                Sign in
              </Button>
            )}
            <Button
              size="regular"
              variant="text"
              tw="mt-4 border border-gray-200 dark:border-gray-600"
              onPress={redirectToCreateDrop}
            >
              <Plus />
              Create
            </Button>
            <Divider tw="my-6" />
            <View tw="rounded-2xl border  border-gray-200 pb-2 pt-4 dark:border-gray-600">
              <View tw="flex-row items-center justify-center">
                <PhonePortraitOutline
                  color={iconColor}
                  width={18}
                  height={18}
                />
                <Text tw="ml-1 text-lg font-bold dark:text-white">Get app</Text>
              </View>
              <View tw="flex items-center justify-between px-2 pt-3">
                <TextLink
                  tw="text-base font-bold dark:text-white"
                  href="https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688"
                  target="_blank"
                >
                  <Image
                    source={{
                      uri: isDark
                        ? "/assets/AppStoreDark.png"
                        : "/assets/AppStoreLight.png",
                    }}
                    width={110}
                    height={32}
                    tw="duration-150 hover:scale-105"
                    alt="App Store"
                  />
                </TextLink>
                <TextLink
                  tw="text-base font-bold dark:text-white"
                  href="https://play.google.com/store/apps/details?id=io.showtime"
                  target="_blank"
                >
                  <Image
                    source={{
                      uri: isDark
                        ? "/assets/GooglePlayDark.png"
                        : "/assets/GooglePlayLight.png",
                    }}
                    width={103}
                    height={30}
                    tw="duration-150 hover:scale-105"
                    alt="Google Play"
                  />
                </TextLink>
              </View>
            </View>
          </View>
        </View>
        <View tw="absolute bottom-2 inline-block">
          <View tw="inline-block">
            {links.map((item, index) => (
              <TextLink
                href={item.link}
                target="_blank"
                tw="text-xs text-gray-500 dark:text-gray-300"
                key={item.title}
              >
                {item.title}
                {` · `}
              </TextLink>
            ))}
          </View>
          <Text tw="text-xs text-gray-500 dark:text-gray-300">
            © 2023 Showtime Technologies, Inc.
          </Text>
          <View tw="mt-4 inline-block w-full">
            {social.map((item) => (
              <Link
                href={item.link}
                hrefAttrs={{
                  target: "_blank",
                  rel: "noreferrer",
                }}
                key={item.title}
                tw="inline-block w-1/4"
              >
                {item?.icon({
                  color: colors.gray[400],
                  width: 20,
                  height: 20,
                })}
              </Link>
            ))}
          </View>
        </View>
      </View>
    );
  }
);

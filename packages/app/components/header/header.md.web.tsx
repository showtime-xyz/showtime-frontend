import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Platform } from "react-native";

import * as Popover from "@radix-ui/react-popover";
import { SvgProps } from "react-native-svg";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { Divider } from "@showtime-xyz/universal.divider";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Bell,
  Home,
  Search,
  ShowtimeBrand,
  Hot,
  User,
  Plus,
  PhonePortraitOutline,
  CreatorChannel,
  Settings,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { Notifications } from "app/components/notifications";
import { useFooter } from "app/hooks/use-footer";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { Link, TextLink } from "app/navigation/link";
import { NotificationsTabBarIcon } from "app/navigation/tab-bar-icons";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { withColorScheme } from "../memo-with-theme";

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

export const HeaderMd = withColorScheme(() => {
  const { user, isAuthenticated } = useUser();
  const redirectToCreateDrop = useRedirectToCreateDrop();
  const navigateToLogin = useNavigateToLogin();
  const { links, social } = useFooter();
  const isDark = useIsDarkMode();
  const router = useRouter();
  const iconColor = isDark ? "#fff" : "#000";

  const HOME_ROUTES = useMemo(
    () =>
      [
        {
          title: "Home",
          key: "Home",
          icon: Home,
          pathname: "/",
          focused: router.pathname === "/",
          visible: true,
        },
        {
          title: "Channels",
          key: "Channels",
          icon: CreatorChannel,
          pathname: "/channels",
          focused: router.pathname.includes("channels"),
          visible: isAuthenticated,
        },
        {
          title: "Trending",
          key: "Trending",
          icon: Hot,
          pathname: "/trending",
          focused: router.pathname === "/trending",
          visible: true,
        },
        {
          title: "Notifications",
          key: "Notifications",
          icon: Bell,
          pathname: "/notifications",
          focused: router.pathname === "/notifications",
          visible: isAuthenticated,
        },
        {
          title: "Settings",
          key: "Settings",
          icon: Settings,
          pathname: "/settings",
          focused: router.pathname === "/settings",
          visible: isAuthenticated,
        },
        {
          title: "Search",
          key: "Search",
          icon: Search,
          pathname: "/search",
          focused: router.pathname === "/search",
          visible: true,
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
          visible: isAuthenticated,
        },
      ].filter((item) => !!item?.visible),
    [
      isAuthenticated,
      router.asPath,
      router.pathname,
      user?.data?.profile?.img_url,
      user?.data?.profile.username,
    ]
  );

  return (
    <View tw="fixed top-0 h-full bg-white pl-2 dark:bg-black">
      <View
        tw="h-full w-60 overflow-y-auto pl-4"
        style={{ maxHeight: "calc(100vh - 130px)" }}
      >
        <Link href="/" tw="flex-row items-center pt-8">
          <ShowtimeBrand color={iconColor} width={19 * (84 / 16)} height={19} />
        </Link>
        <View tw="-ml-4 mt-5 w-44 justify-center">
          {HOME_ROUTES.map((item) => (
            <Link
              tw={[
                "mt-2 h-[50px] flex-row items-center rounded-2xl pl-4 transition-all hover:bg-gray-50 hover:dark:bg-gray-900",
                item.focused && "bg-coolGray-50 dark:bg-gray-800",
              ].join(" ")}
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
              <>
                <Text tw="text-base font-bold text-white dark:text-black">
                  Sign in
                </Text>
              </>
            </Button>
          )}
          <Button
            size="regular"
            variant="text"
            tw="mt-4 border border-gray-200 dark:border-gray-600"
            onPress={redirectToCreateDrop}
          >
            <>
              <Plus width={20} height={20} color={isDark ? "#fff" : "#000"} />
              <Text tw="ml-2 text-base font-bold text-black dark:text-white">
                Create
              </Text>
            </>
          </Button>
          <Divider tw="my-6" />
          <View tw="rounded-2xl border  border-gray-200 pb-2 pt-4 dark:border-gray-600">
            <View tw="flex-row items-center justify-center">
              <PhonePortraitOutline color={iconColor} width={18} height={18} />
              <Text tw="text-15 ml-1 font-bold dark:text-white">Get App</Text>
            </View>
            <View tw="flex items-center justify-between px-2 pt-4">
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
      <View tw="absolute bottom-2 inline-block pl-3">
        <View tw="inline-block">
          {links.map((item) => (
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
});

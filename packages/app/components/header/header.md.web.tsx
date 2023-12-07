import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { usePrivy } from "@privy-io/react-auth";
import * as Popover from "@radix-ui/react-popover";
import { SvgProps } from "react-native-svg";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Divider } from "@showtime-xyz/universal.divider";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  Bell,
  BellFilled,
  Home,
  Search as SearchIcon,
  ShowtimeBrand,
  User,
  PhonePortraitOutline,
  CreatorChannel,
  Settings,
  Menu,
  Edit,
  Moon,
  Sun,
  DarkMode,
  LogOut,
  ChevronRight,
  SearchFilled,
  Download3,
  AccessTicket,
} from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { ErrorBoundary } from "app/components/error-boundary";
import { Notifications } from "app/components/notifications";
import { Search } from "app/components/search";
import { useAuth } from "app/hooks/auth/use-auth";
import { downloadCollectorList } from "app/hooks/use-download-collector-list";
import { useFooter } from "app/hooks/use-footer";
import { useNotifications } from "app/hooks/use-notifications";
import { useUser } from "app/hooks/use-user";
import { Link, TextLink } from "app/navigation/link";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "design-system/dropdown-menu";

import { useChannelsUnreadMessages } from "../creator-channels/hooks/use-channels-unread-messages";
import { useLogin } from "../login/use-login";
import { withColorScheme } from "../memo-with-theme";
import { CreateButtonDesktop } from "../upload/components/icons/create-icon-xl";

const NotificationsInHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasUnreadNotification } = useNotifications();

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
  const Icon = isOpen ? BellFilled : Bell;
  return (
    <Popover.Root modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <View tw="mt-2 h-12 flex-row items-center rounded-2xl pl-4 transition-all hover:bg-gray-50 hover:dark:bg-gray-900">
          <View>
            <Icon color={isDark ? "#fff" : "#000"} width={24} height={24} />
            <View
              tw="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500 "
              style={{ opacity: hasUnreadNotification ? 1 : 0 }}
            />
          </View>
          <Text tw={["ml-4 text-lg text-black dark:text-white"]}>
            Notifications
          </Text>
        </View>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={36} side="right" align="center">
          <View
            tw="h-screen w-[450px] overflow-hidden border-l border-gray-200 bg-white dark:border-r dark:border-gray-800 dark:bg-black"
            style={{
              // @ts-ignore
              boxShadow: "rgb(0 0 0 / 10%) 5px 15px 15px",
            }}
          >
            <ErrorBoundary>
              <Suspense
                fallback={
                  <View tw="p-4">
                    <Spinner />
                  </View>
                }
              >
                <Notifications useWindowScroll={false} />
              </Suspense>
            </ErrorBoundary>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const SearchInHeader = () => {
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

  const Icon = isOpen ? SearchFilled : SearchIcon;
  return (
    <Popover.Root modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <View tw="mt-2 h-12 flex-row items-center rounded-2xl pl-4 transition-all hover:bg-gray-50 hover:dark:bg-gray-900">
          <Icon color={isDark ? "#fff" : "#000"} width={24} height={24} />
          <Text tw={["ml-4 text-lg text-black dark:text-white"]}>Search</Text>
        </View>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={36} side="right" align="center">
          <View
            tw="h-screen w-[450px] overflow-hidden border-l border-gray-200 bg-white dark:border-r dark:border-gray-800 dark:bg-black"
            style={{
              // @ts-ignore
              boxShadow: "rgb(0 0 0 / 10%) 5px 15px 15px",
            }}
          >
            <ErrorBoundary>
              <Suspense
                fallback={
                  <View tw="p-4">
                    <Spinner />
                  </View>
                }
              >
                <Search />
              </Suspense>
            </ErrorBoundary>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
const MenuItem = ({
  focused,
  href,
  icon,
  title,
}: {
  focused?: boolean;
  href: string;
  icon: any;
  title: string;
}) => {
  return (
    <Link
      tw={[
        "mt-2 h-[50px] flex-row items-center rounded-2xl pl-4 transition-all hover:bg-gray-100 hover:dark:bg-gray-900",
        focused && "bg-gray-100 dark:bg-gray-800",
      ].join(" ")}
      href={href}
    >
      {icon()}
      <Text
        tw={[
          "ml-4 text-lg text-black dark:text-white",
          focused ? "font-bold" : "font-normal",
        ]}
      >
        {title}
      </Text>
    </Link>
  );
};

const ChannelsUnreadMessages = () => {
  const { data } = useChannelsUnreadMessages();

  if (!data || data.unread <= 0) return null;

  return (
    <View tw="absolute right-2 items-center justify-center rounded-full bg-indigo-500 px-2.5 py-1.5 text-center">
      <Text tw="text-center text-sm text-white" style={{ lineHeight: 12 }}>
        {data.unread > 99 ? "99+" : data.unread}
      </Text>
    </View>
  );
};

export const HeaderMd = withColorScheme(() => {
  const { user, isAuthenticated } = useUser();
  const { handleSubmitWallet, loading: loginLoading } = useLogin();
  const { links, social } = useFooter();
  const isDark = useIsDarkMode();
  const router = useRouter();
  const iconColor = isDark ? "#fff" : "#000";
  const { setColorScheme } = useColorScheme();
  const { logout } = useAuth();
  const { height: screenHeight } = useWindowDimensions();
  const privy = usePrivy();

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
        // {
        //   title: "Trending",
        //   key: "Trending",
        //   icon: Hot,
        //   pathname: "/trending",
        //   focused: router.pathname === "/trending",
        //   visible: true,
        // },
        {
          title: "Notifications",
          key: "Notifications",
          icon: Bell,
          pathname: "/notifications",
          visible: isAuthenticated,
        },

        {
          title: "Search",
          key: "Search",
          icon: SearchIcon,
          pathname: "/search",
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
          pathname: `/@${user?.data?.profile.username}`,
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
    <View tw="md:w-[248px]">
      <View tw="fixed max-h-screen overflow-y-auto bg-white pl-2 dark:bg-black">
        <View tw="h-full min-h-screen w-60 pl-4">
          <Link
            href="/"
            tw="flex-row items-center"
            style={{
              paddingTop: screenHeight > 860 ? 40 : 24,
            }}
          >
            <ShowtimeBrand
              color={iconColor}
              width={19 * (84 / 16)}
              height={19}
            />
          </Link>
          <View tw="-ml-4 mt-5 w-48 justify-center">
            {HOME_ROUTES.map((item) => {
              if (item.key === "Notifications") {
                return <NotificationsInHeader key={item.key} />;
              }
              if (item.key === "Search") {
                return <SearchInHeader key={item.key} />;
              }
              return (
                <MenuItem
                  focused={item.focused}
                  href={item.pathname}
                  icon={() => {
                    return (
                      <>
                        {item.icon({
                          color: iconColor,
                          width: 24,
                          height: 24,
                        })}
                        {item.key === "Channels" ? (
                          <ChannelsUnreadMessages />
                        ) : null}
                      </>
                    );
                  }}
                  title={item.title}
                  key={item.pathname}
                />
              );
            })}

            <DropdownMenuRoot>
              <DropdownMenuTrigger>
                <View
                  tw={[
                    "mt-2 h-12 cursor-pointer flex-row items-center rounded-2xl pl-4 transition-all hover:bg-gray-50 hover:dark:bg-gray-900",
                  ]}
                >
                  <Menu width={24} height={24} color={iconColor} />
                  <Text tw={["ml-4 text-lg text-black dark:text-white"]}>
                    More
                  </Text>
                </View>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="center"
                style={{ minWidth: 150 }}
                disableBlurEffect
                side="bottom"
                sideOffset={0}
              >
                {isAuthenticated && (
                  <DropdownMenuItem
                    onSelect={() => router.push("/settings")}
                    key="your-settings"
                  >
                    <MenuItemIcon Icon={Settings} />

                    <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-100">
                      Settings
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                )}

                {isAuthenticated && (
                  <DropdownMenuItem
                    onSelect={() => {
                      router.push(
                        Platform.select({
                          native: "/profile/edit",
                          web: {
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              editProfileModal: true,
                            },
                          } as any,
                        }),
                        Platform.select({
                          native: "/profile/edit",
                          web: router.asPath,
                        })
                      );
                    }}
                    key="edit-profile"
                  >
                    <MenuItemIcon
                      Icon={Edit}
                      ios={{
                        name: "square.and.pencil",
                      }}
                    />

                    <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-100">
                      Edit Profile
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                )}
                {isAuthenticated && (
                  <DropdownMenuItem
                    onSelect={() => {
                      downloadCollectorList();
                    }}
                    key="download-collector-list"
                  >
                    <MenuItemIcon
                      Icon={Download3}
                      ios={{
                        name: "arrow.down.doc",
                      }}
                    />

                    <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
                      Download collector list
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                )}
                {isAuthenticated && (
                  <DropdownMenuItem
                    onSelect={() => {
                      const as = "/creator-token/import-allowlist";
                      router.push(
                        Platform.select({
                          native: as,
                          web: {
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              creatorTokensImportAllowlistModal: true,
                            },
                          } as any,
                        }),
                        Platform.select({ native: as, web: router.asPath }),
                        {
                          shallow: true,
                        }
                      );
                    }}
                    key="import-allowlist"
                  >
                    <MenuItemIcon
                      Icon={AccessTicket}
                      ios={{
                        name: "ticket",
                      }}
                    />

                    <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
                      Import allowlist to channel
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger key="nested-group-trigger">
                    <MenuItemIcon
                      Icon={isDark ? Moon : Sun}
                      ios={{
                        name: isDark ? "moon" : "sun.max",
                      }}
                    />

                    <DropdownMenuItemTitle tw="w-full text-gray-700 dark:text-neutral-100">
                      Theme
                    </DropdownMenuItemTitle>

                    <View tw="absolute right-0">
                      <ChevronRight
                        width={20}
                        height={20}
                        color={isDark ? "#fff" : colors.gray[900]}
                      />
                    </View>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent
                    disableBlurEffect
                    alignOffset={-8}
                    sideOffset={4}
                  >
                    <DropdownMenuItem
                      onSelect={() => setColorScheme("light")}
                      key="nested-group-1"
                    >
                      <MenuItemIcon Icon={Sun} ios={{ name: "sun.max" }} />
                      <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-100">
                        Light
                      </DropdownMenuItemTitle>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setColorScheme("dark")}
                      key="nested-group-2"
                    >
                      <MenuItemIcon Icon={Moon} ios={{ name: "moon" }} />
                      <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-100">
                        Dark
                      </DropdownMenuItemTitle>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setColorScheme(null)}
                      key="nested-group-3"
                    >
                      <MenuItemIcon
                        Icon={DarkMode}
                        ios={{
                          name: "circle.righthalf.filled",
                        }}
                      />
                      <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-100">
                        System
                      </DropdownMenuItemTitle>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {isAuthenticated && (
                  <DropdownMenuItem
                    destructive
                    onSelect={logout}
                    key="sign-out"
                  >
                    <MenuItemIcon
                      Icon={LogOut}
                      ios={{ name: "rectangle.portrait.and.arrow.right" }}
                    />
                    <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-100">
                      Sign Out
                    </DropdownMenuItemTitle>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </View>
          <View tw="w-40">
            {!isAuthenticated && (
              <>
                <Button
                  size="small"
                  tw="mt-4 !h-10"
                  onPress={handleSubmitWallet}
                  disabled={loginLoading}
                >
                  <>
                    <Text tw="text-[14px] font-semibold text-white dark:text-black">
                      {loginLoading ? "loading..." : "Connect"}
                    </Text>
                  </>
                </Button>
                <Button
                  size="small"
                  tw="mt-4 !h-10"
                  disabled={loginLoading}
                  onPress={async () => {
                    if (privy.authenticated) {
                      await privy.logout();
                    }
                    privy.login();
                  }}
                >
                  <>
                    <Text tw="text-[14px] font-semibold text-white dark:text-black">
                      {loginLoading ? "loading..." : "Phone & Social"}
                    </Text>
                  </>
                </Button>
              </>
            )}
            <Divider tw="my-4" />
            <CreateButtonDesktop />
            <Divider tw="my-4" />
            <View tw="rounded-2xl border  border-gray-200 pb-2 pt-4 dark:border-gray-600">
              <View tw="flex-row items-center justify-center">
                <PhonePortraitOutline
                  color={iconColor}
                  width={18}
                  height={18}
                />
                <Text tw="text-15 ml-1 font-bold dark:text-white">Get App</Text>
              </View>
              <View tw="flex items-center justify-between px-2 pt-4">
                <Link
                  href="https://apps.apple.com/us/app/showtime-nft-social-network/id1606611688"
                  target="_blank"
                  tw="duration-150 hover:scale-105"
                >
                  <Image
                    source={{
                      uri: "/assets/AppStoreDownload.png",
                    }}
                    width={120}
                    height={40}
                    alt="App Store"
                  />
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=io.showtime"
                  target="_blank"
                  tw="mt-2 duration-150 hover:scale-105"
                >
                  <Image
                    source={{
                      uri: "/assets/GooglePlayDownload.png",
                    }}
                    width={120}
                    height={40}
                    alt="Google Play"
                  />
                </Link>
              </View>
            </View>
          </View>
          <View
            tw={[
              "bottom-0 mt-4 inline-block",
              screenHeight > 840 ? "absolute" : "relative",
            ]}
            style={{}}
          >
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
            <View tw="mt-2 inline-block w-full">
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
      </View>
    </View>
  );
});

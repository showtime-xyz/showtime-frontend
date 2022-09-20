import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { Platform, TextInput, useWindowDimensions } from "react-native";

import * as Popover from "@radix-ui/react-popover";
import { ListRenderItemInfo } from "@shopify/flash-list";

import { Button } from "@showtime-xyz/universal.button";
import {
  useBlurredBackgroundStyles,
  useIsDarkMode,
} from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Close, Plus, Search } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Input } from "@showtime-xyz/universal.input";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
// import { NetworkButton } from "app/components/connect-button";
import { HeaderDropdown } from "app/components/header-dropdown";
import { Notifications } from "app/components/notifications";
import { SearchItem, SearchItemSkeleton } from "app/components/search";
import { SearchResponseItem, useSearch } from "app/hooks/api/use-search";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { Link } from "app/navigation/link";
import {
  ShowtimeTabBarIcon,
  TrendingTabBarIcon,
  NotificationsTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { breakpoints } from "design-system/theme";

import { withColorScheme } from "./memo-with-theme";

const SearchInHeader = () => {
  const isDark = useIsDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [term, setTerm] = useState("");
  const { loading, data } = useSearch(term);
  const inputRef = useRef<TextInput>();

  useEffect(() => {
    if (term !== "") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [term]);

  const Separator = useCallback(
    () => <View tw="h-[1px] bg-gray-200 dark:bg-gray-800" />,
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SearchResponseItem>) => {
      return (
        <SearchItem
          item={item}
          onPress={() => {
            setIsOpen(false);
          }}
        />
      );
    },
    [setIsOpen]
  );

  return (
    <Popover.Root modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger />

      <Popover.Anchor>
        <Input
          placeholder="Search for @name or name.eth"
          autocomplete="off"
          value={term}
          ref={inputRef}
          onChangeText={(text) => {
            setTerm(text);
            inputRef.current?.focus();
          }}
          leftElement={
            <View tw="h-12 w-12 items-center justify-center rounded-full">
              <Search
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  width: 24,
                  height: 24,
                }}
                color={isDark ? colors.gray[400] : colors.gray[500]}
                width={24}
                height={24}
              />
            </View>
          }
          rightElement={
            term.length > 0 ? (
              <Popover.Close>
                <PressableScale
                  style={{ padding: 8 }}
                  onPress={() => {
                    setTerm("");
                    inputRef.current?.focus();
                  }}
                  hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                >
                  <Close
                    color={isDark ? colors.gray[400] : colors.gray[600]}
                    width={24}
                    height={24}
                  />
                </PressableScale>
              </Popover.Close>
            ) : undefined
          }
          inputStyle={{ width: 269 }}
        />
      </Popover.Anchor>

      <Popover.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <View tw="mt-2 w-[350px] rounded-3xl bg-white shadow-lg shadow-black dark:bg-black dark:shadow-white">
          {data ? (
            <InfiniteScrollList
              useWindowScroll={false}
              data={data}
              renderItem={renderItem}
              ItemSeparatorComponent={Separator}
              keyboardShouldPersistTaps="handled"
              estimatedItemSize={64}
              overscan={{
                main: 64,
                reverse: 64,
              }}
              style={Platform.select({
                web: { height: "calc(50vh - 64px)" },
                default: {},
              })}
            />
          ) : loading && term ? (
            <SearchItemSkeleton />
          ) : null}
        </View>
      </Popover.Content>
    </Popover.Root>
  );
};

const NotificationsInHeader = () => {
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
      >
        <View
          tw="dark:shadow-dark shadow-light mt-2 w-[480px] overflow-hidden rounded-3xl bg-white dark:bg-black md:max-w-md"
          style={Platform.select({
            web: {
              height: "calc(50vh - 64px)",
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
              <Notifications useWindowScroll={false} />
            </Suspense>
          </ErrorBoundary>
        </View>
      </Popover.Content>
    </Popover.Root>
  );
};

const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const isMdWidth = width >= breakpoints["md"];
  const navigateToLogin = useNavigateToLogin();
  const redirectToDrop = useRedirectToCreateDrop();

  return (
    <View>
      {!isLoading && (
        <View tw="flex-row items-center">
          {isAuthenticated && isMdWidth && (
            <>
              <View tw="mx-2">
                <TrendingTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={router.pathname === "/trending"}
                />
              </View>
              <View tw="mx-2">
                <NotificationsInHeader />
              </View>
              <View tw="mx-2">
                <PressableHover onPress={redirectToDrop}>
                  <View
                    testID="mint-nft"
                    tw={[
                      "h-12 w-12 items-center justify-center rounded-full",
                      "bg-black dark:bg-white",
                    ]}
                  >
                    <Plus
                      width={24}
                      height={24}
                      color={isDark ? "black" : "white"}
                    />
                  </View>
                </PressableHover>
              </View>
            </>
          )}
          <View tw="flex-row items-center md:mx-2">
            {isAuthenticated ? (
              <HeaderDropdown type={isMdWidth ? "profile" : "settings"} />
            ) : (
              <>
                {isMdWidth && (
                  <View tw="mx-3">
                    <TrendingTabBarIcon
                      color={isDark ? "white" : "black"}
                      focused={router.pathname === "/trending"}
                    />
                  </View>
                )}
                <Button
                  onPress={() => {
                    navigateToLogin();
                  }}
                  variant="primary"
                  size={isMdWidth ? "regular" : "small"}
                  labelTW="font-semibold"
                >
                  Sign&nbsp;In
                </Button>
              </>
            )}
            {/* {Platform.OS === "web" ? <NetworkButton /> : null} */}
          </View>
        </View>
      )}
    </View>
  );
};

const HeaderLeft = ({ canGoBack }: { canGoBack: boolean }) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const Icon = canGoBack ? ArrowLeft : Search;

  return (
    <PressableScale
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{
        height: 24,
        width: 24,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 9999,
      }}
      onPress={() => {
        if (canGoBack) {
          router.pop();
        } else {
          router.push("/search");
        }
      }}
    >
      <Icon
        style={{ borderRadius: 8, overflow: "hidden", width: 24, height: 24 }}
        color={isDark ? "#FFF" : "#000"}
        width={24}
        height={24}
      />
    </PressableScale>
  );
};

const HeaderCenter = ({
  isDark,
  isMdWidth,
}: {
  isDark?: boolean;
  isMdWidth?: boolean;
}) => {
  return (
    <View tw="flex flex-row">
      <Link href="/">
        <ShowtimeTabBarIcon color={isDark ? "black" : "white"} tw="mr-4" />
      </Link>
      {isMdWidth ? <SearchInHeader /> : null}
    </View>
  );
};

const Header = withColorScheme(({ canGoBack }: { canGoBack: boolean }) => {
  const { width } = useWindowDimensions();
  const { isHeaderHidden } = useNavigationElements();
  const blurredBackgroundStyles = useBlurredBackgroundStyles(95);
  const isDark = useIsDarkMode();
  const isMdWidth = width >= breakpoints["md"];

  if (isMdWidth) {
    return (
      <View
        // @ts-expect-error
        style={{
          position: "sticky",
        }}
        tw="top-0 right-0 left-0 z-50 w-full items-center bg-white shadow-sm dark:bg-black"
      >
        <View tw="h-16 w-full max-w-screen-2xl flex-row justify-between px-4 py-2">
          <View tw="items-start">
            <HeaderCenter isDark={isDark} isMdWidth={isMdWidth} />
          </View>
          <View tw="items-end">
            <HeaderRight />
          </View>
        </View>
      </View>
    );
  }

  if (isHeaderHidden) {
    return null;
  }

  return (
    <View
      // @ts-expect-error
      style={{
        position: "sticky",
        ...blurredBackgroundStyles,
      }}
      tw="top-0 right-0 left-0 z-50 h-16 w-full flex-row items-center justify-between px-4 py-2 shadow-sm"
    >
      <View tw="w-20 items-start">
        <HeaderLeft canGoBack={canGoBack} />
      </View>
      <View tw="w-20 items-center">
        <HeaderCenter />
      </View>
      <View tw="w-20 items-end">
        <HeaderRight />
      </View>
    </View>
  );
});

export { Header, HeaderLeft, HeaderCenter, HeaderRight };

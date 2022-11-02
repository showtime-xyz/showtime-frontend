import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { Platform, TextInput, useWindowDimensions } from "react-native";

import * as Popover from "@radix-ui/react-popover";
import { ListRenderItemInfo } from "@shopify/flash-list";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close, Search } from "@showtime-xyz/universal.icon";
import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Input } from "@showtime-xyz/universal.input";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { Notifications } from "app/components/notifications";
import { SearchItem, SearchItemSkeleton } from "app/components/search";
import {
  WEB_HEADER_HEIGHT,
  MOBILE_WEB_HEADER_HEIGHT,
} from "app/constants/layout";
import { SearchResponseItem, useSearch } from "app/hooks/api/use-search";
import { NotificationsTabBarIcon } from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { breakpoints } from "design-system/theme";

import { withColorScheme } from "../memo-with-theme";
import { HeaderCenter } from "./header-center";
import { HeaderLeft } from "./header-left";
import { HeaderRight } from "./header-right";

export const SearchInHeader = () => {
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
              <Notifications useWindowScroll={false} hideHeader />
            </Suspense>
          </ErrorBoundary>
        </View>
      </Popover.Content>
    </Popover.Root>
  );
};

export const Header = withColorScheme(
  ({ canGoBack }: { canGoBack: boolean }) => {
    const { width } = useWindowDimensions();
    const { isHeaderHidden } = useNavigationElements();
    const isDark = useIsDarkMode();
    const isMdWidth = width >= breakpoints["md"];

    if (isMdWidth) {
      return (
        <View tw="fixed top-0 right-0 left-0 z-50 w-screen items-center bg-white/60 stroke-inherit shadow-sm backdrop-blur-md dark:bg-black/60">
          <View
            style={{
              height: WEB_HEADER_HEIGHT,
            }}
            tw="w-full max-w-screen-2xl flex-row justify-between px-4 py-2"
          >
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
        style={{ height: MOBILE_WEB_HEADER_HEIGHT }}
        tw="fixed top-0 right-0 left-0 z-50 h-16 w-full flex-row items-center justify-between px-4 py-2"
      >
        <View tw="w-20 items-start">
          <HeaderLeft withBackground={!isMdWidth} canGoBack={canGoBack} />
        </View>

        <View tw="w-20 items-end">
          <HeaderRight withBackground={!isMdWidth} />
        </View>
      </View>
    );
  }
);

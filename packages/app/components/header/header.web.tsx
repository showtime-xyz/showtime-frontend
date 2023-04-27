import { useEffect, useRef, useState, Suspense } from "react";
import { Platform, useWindowDimensions } from "react-native";

import * as Popover from "@radix-ui/react-popover";
import dynamic from "next/dynamic";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { Notifications } from "app/components/notifications";
import { WEB_HEADER_HEIGHT } from "app/constants/layout";
import { useUser } from "app/hooks/use-user";
import { SWIPE_LIST_SCREENS } from "app/lib/constants";
import { NotificationsTabBarIcon } from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

import { withColorScheme } from "../memo-with-theme";
import HeaderCenter from "./header-center";
import { HeaderLeft } from "./header-left";
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

export const Header = withColorScheme(
  ({ canGoBack }: { canGoBack: boolean }) => {
    const { isHeaderHidden } = useNavigationElements();
    const isDark = useIsDarkMode();
    const router = useRouter();
    const { isAuthenticated } = useUser();

    if (isHeaderHidden) {
      return null;
    }
    return (
      <>
        <View tw="fixed left-0 right-0 top-0 z-50 hidden w-screen items-center bg-white/60 stroke-inherit backdrop-blur-md dark:bg-black/60 md:flex">
          <View
            style={{
              height: WEB_HEADER_HEIGHT,
            }}
            tw="w-full max-w-screen-2xl flex-row justify-between px-4 py-2"
          >
            <View tw="items-start">
              <HeaderCenter isDark={isDark} />
            </View>
            <View tw="items-end">
              <HeaderRight />
            </View>
          </View>
        </View>
        <>
          <View tw={["fixed left-4 top-2 z-10 flex md:hidden"]}>
            <HeaderLeft withBackground canGoBack={canGoBack} />
          </View>
          {(!SWIPE_LIST_SCREENS.includes(router.pathname) ||
            !isAuthenticated) && (
            <View tw={["fixed right-4 top-2 z-10 flex md:hidden"]}>
              <HeaderRight withBackground />
            </View>
          )}
        </>
      </>
    );
  }
);

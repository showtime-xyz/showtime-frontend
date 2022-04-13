import { useState } from "react";
import { useWindowDimensions, Platform } from "react-native";

import { HeaderDropdown } from "app/components/header-dropdown";
import { useUser } from "app/hooks/use-user";
import {
  CameraTabBarIcon,
  TrendingTabBarIcon,
  NotificationsTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";
import { useRouter } from "app/navigation/use-router";

import { View, Pressable, Button } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { useBlurredBackgroundColor } from "design-system/hooks";
import { Showtime, Search, ArrowLeft } from "design-system/icon";
import { tw } from "design-system/tailwind";

const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();

  return (
    <View>
      {!isLoading && (
        <View tw={[isSearchBarOpen ? "hidden" : "", "flex-row items-center"]}>
          {isAuthenticated && width > 768 && (
            <>
              <View tw="mx-3">
                <CameraTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={false}
                />
              </View>
              <View tw="mx-3">
                <TrendingTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={router.pathname === "/trending"}
                />
              </View>
              <View tw="mx-3">
                <NotificationsTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={router.pathname === "/notifications"}
                />
              </View>
            </>
          )}
          <View tw="md:mx-3">
            {isAuthenticated ? (
              <HeaderDropdown type={width > 768 ? "profile" : "settings"} />
            ) : (
              <Button
                onPress={() => {
                  router.push(
                    Platform.select({
                      native: "/login",
                      web: {
                        pathname: router.pathname,
                        query: { ...router.query, login: true },
                      },
                    }),
                    "/login",
                    { shallow: true }
                  );
                }}
                variant="primary"
                size={width > 768 ? "regular" : "small"}
                labelTW="font-semibold"
              >
                Sign&nbsp;In
              </Button>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const HeaderLeft = ({ canGoBack }: { canGoBack: boolean }) => {
  const router = useRouter();
  const Icon = canGoBack ? ArrowLeft : Search;

  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      tw="w-6 h-6 rounded-full items-center justify-center"
      onPress={() => {
        if (canGoBack) {
          router.pop();
        } else {
          router.push("/search");
        }
      }}
      // animate={useCallback(({ hovered }) => {
      // 	'worklet'

      // 	return hovered
      // 		? tw.style('bg-gray-100 dark:bg-gray-900 md:dark:bg-gray-800')
      // 		: tw.style('bg-white dark:bg-black md:dark:bg-gray-900')
      // }, [])}
    >
      <Icon
        style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
        color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
        width={24}
        height={24}
      />
    </Pressable>
  );
};

const HeaderCenter = () => {
  // TODO: why is this crashing the native header?
  // const router = useRouter();

  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      tw="w-12 h-12 rounded-full items-center justify-center"
      onPress={() => {
        if (Platform.OS === "web") {
          // router.push("/");
        }
      }}
      // animate={useCallback(({ hovered }) => {
      // 	'worklet'

      // 	return hovered
      // 		? tw.style('bg-gray-100 dark:bg-gray-900 md:dark:bg-gray-800')
      // 		: tw.style('bg-white dark:bg-black md:dark:bg-gray-900')
      // }, [])}
    >
      <Showtime
        style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
        color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
        width={24}
        height={24}
      />
    </Pressable>
  );
};

const Header = ({ canGoBack }: { canGoBack: boolean }) => {
  const { width } = useWindowDimensions();
  const { isHeaderHidden } = useNavigationElements();
  const blurredBackgroundColor = useBlurredBackgroundColor(95);

  if (width >= 768) {
    return (
      <View
        // @ts-expect-error
        style={{
          position: "sticky",
        }}
        tw="bg-white dark:bg-black top-0 right-0 left-0 z-50 h-16 flex-row items-center justify-between px-4 py-2"
      >
        <View tw="items-start">
          <HeaderCenter />
        </View>
        <View tw="items-end">
          <HeaderRight />
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
        backdropFilter: "blur(20px)",
        backgroundColor: blurredBackgroundColor,
      }}
      tw="top-0 right-0 left-0 z-50 h-16 flex-row items-center justify-between px-4 py-2"
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
};

export { Header, HeaderLeft, HeaderCenter, HeaderRight };

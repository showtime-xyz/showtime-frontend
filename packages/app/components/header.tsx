import { useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import Router from "next/router";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

import { useRouter } from "app/navigation/use-router";
import { View, Pressable, Button, ButtonLabel } from "design-system";
import { Showtime, Wallet, Plus, Search, ArrowLeft } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { useUser } from "app/hooks/use-user";
import { NotificationsTabBarIcon } from "app/navigation/tab-bar-icons";
import { HeaderDropdown } from "app/components/header-dropdown";

const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const { width } = useWindowDimensions();

  const openLogin = useCallback(() => {
    const as = `${router.pathname !== "/" ? router.pathname : ""}/login`;

    const href = Router.router
      ? {
          pathname: Router.pathname,
          query: { ...Router.query },
        }
      : as;

    router.push(href, as, { shallow: true });
  }, [router, Router]);

  return (
    <View tw="mr-4 mb-2">
      {!isLoading && (
        <View tw={`${isSearchBarOpen ? "hidden" : ""} flex-row items-center`}>
          {isAuthenticated && (
            <View tw="hidden md:flex">
              <NotificationsTabBarIcon color="white" focused={false} />
            </View>
          )}
          {isAuthenticated ? (
            <View>
              {width > 768 && (
                <View tw="mx-3">
                  <Button
                    onPress={() => {}}
                    variant="primary"
                    tw="p-2.5 md:px-3.5 md:py-1.5 rounded-full h-10 w-10 md:w-auto"
                  >
                    <ButtonLabel tw="hidden md:flex">Create</ButtonLabel>
                    <Plus
                      style={tw.style("md:hidden")}
                      width={20}
                      height={20}
                      color={
                        tw.style("bg-white dark:bg-black")
                          ?.backgroundColor as string
                      }
                    />
                  </Button>
                </View>
              )}

              <HeaderDropdown />
            </View>
          ) : (
            <Button
              onPress={() => {
                if (!router.pathname.includes("/login")) {
                  openLogin();
                }
              }}
              variant="primary"
            >
              <Wallet
                color={
                  tw.style("bg-white dark:bg-black")?.backgroundColor as string
                }
              />
              <ButtonLabel tw="pl-2">Sign&nbsp;in</ButtonLabel>
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

const HeaderLeft = ({ canGoBack }: { canGoBack: boolean }) => {
  const router = useRouter();
  const Icon = canGoBack ? ArrowLeft : Search;

  return (
    <View>
      <Pressable
        tw="w-12 h-12 ml-4 mb-2 rounded-full bg-gray-100 dark:bg-gray-900 items-center justify-center"
        onPress={() => {
          if (canGoBack) {
            router.pop();
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
    </View>
  );
};

const HeaderCenter = () => {
  const router = useRouter();

  return (
    <Pressable
      tw="w-12 h-12 rounded-full items-center justify-center mb-2"
      onPress={() => {
        router.push("/");
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

export { HeaderLeft, HeaderCenter, HeaderRight };

import { useState, useCallback } from "react";
import { useWindowDimensions } from "react-native";
import Router from "next/router";

import { useRouter } from "app/navigation/use-router";
import { View, Pressable, Button, ButtonLabel } from "design-system";
import {
  Showtime,
  ShowtimeGradient,
  Plus,
  Search,
  ArrowLeft,
} from "design-system/icon";
import { tw } from "design-system/tailwind";
import { useUser } from "app/hooks/use-user";
import { NotificationsTabBarIcon } from "app/navigation/tab-bar-icons";
import { HeaderDropdown } from "app/components/header-dropdown";
import { useIsDarkMode } from "design-system/hooks";
import { useToast } from "design-system/toast";

const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const { width } = useWindowDimensions();

  return (
    <View>
      {!isLoading && (
        <View
          tw={[
            isSearchBarOpen ? "hidden" : "",
            "flex-row items-center bg-white dark:bg-black",
          ]}
        >
          {isAuthenticated && (
            <View tw="hidden md:flex">
              <NotificationsTabBarIcon color="white" focused={false} />
            </View>
          )}
          {isAuthenticated ? (
            <View tw="bg-white dark:bg-black">
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
                router.push("/login");
              }}
              variant="primary"
              size="small"
              labelTW="font-semibold"
            >
              Sign&nbsp;In
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

const HeaderLeft = ({ canGoBack }: { canGoBack: boolean }) => {
  const toast = useToast();
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
          toast?.show({ message: "🚧 Coming soon", hideAfter: 4000 });
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
  const router = useRouter();
  const isDark = useIsDarkMode();

  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      tw="w-12 h-12 rounded-full items-center justify-center"
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
      {isDark ? (
        <ShowtimeGradient
          style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
          color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
          width={24}
          height={24}
        />
      ) : (
        <Showtime
          style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
          color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
          width={24}
          height={24}
        />
      )}
    </Pressable>
  );
};

export { HeaderLeft, HeaderCenter, HeaderRight };

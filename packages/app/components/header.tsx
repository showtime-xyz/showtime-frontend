import { useState } from "react";
import { useWindowDimensions, Platform } from "react-native";

import { HeaderDropdown } from "app/components/header-dropdown";
import { useUser } from "app/hooks/use-user";
import { Link } from "app/navigation/link";
import {
  ShowtimeTabBarIcon,
  CameraTabBarIcon,
  TrendingTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";
import { useRouter } from "app/navigation/use-router";

import { View, Pressable, Button } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import { useBlurredBackgroundColor } from "design-system/hooks";
import { Search, ArrowLeft } from "design-system/icon";
import { Input } from "design-system/input";
import { tw } from "design-system/tailwind";
import { breakpoints } from "design-system/theme";

const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDark = useIsDarkMode();
  const isMdWidth = width >= breakpoints["md"];

  return (
    <View>
      {!isLoading && (
        <View tw={[isSearchBarOpen ? "hidden" : "", "flex-row items-center"]}>
          {isAuthenticated && isMdWidth && (
            <>
              <View tw="mx-2">
                <TrendingTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={router.pathname === "/trending"}
                />
              </View>
              <View tw="mx-2">
                <CameraTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={false}
                />
              </View>
            </>
          )}
          <View tw="md:mx-2 flex-row items-center">
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
                    router.push(
                      Platform.select({
                        native: "/login",
                        web: {
                          pathname: router.pathname,
                          query: { ...router.query, loginModal: true },
                        },
                      }),
                      Platform.select({
                        native: "/login",
                        web: router.asPath === "/" ? "/login" : router.asPath,
                      }),
                      { shallow: true }
                    );
                  }}
                  variant="primary"
                  size={isMdWidth ? "regular" : "small"}
                  labelTW="font-semibold"
                >
                  Sign&nbsp;In
                </Button>
              </>
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

const HeaderCenter = ({
  isDark,
  isMdWidth,
}: {
  isDark?: boolean;
  isMdWidth?: boolean;
}) => {
  return (
    <View tw="flex flex-row">
      <ShowtimeTabBarIcon color={isDark ? "black" : "white"} customTw="mr-4" />
      {isMdWidth ? (
        <Input
          placeholder="Search by name or wallet"
          leftElement={
            <View tw="w-12 h-12 rounded-full items-center justify-center">
              <Search
                style={tw.style("rounded-lg overflow-hidden w-6 h-6")}
                color={
                  tw.style("bg-gray-500 dark:bg-gray-400")
                    ?.backgroundColor as string
                }
                width={24}
                height={24}
              />
            </View>
          }
        />
      ) : null}
    </View>
  );
};

const Header = ({ canGoBack }: { canGoBack: boolean }) => {
  const { width } = useWindowDimensions();
  const { isHeaderHidden } = useNavigationElements();
  const blurredBackgroundColor = useBlurredBackgroundColor(95);
  const isDark = useIsDarkMode();
  const isMdWidth = width >= breakpoints["md"];

  if (isMdWidth) {
    return (
      <View
        // @ts-expect-error
        style={{
          position: "sticky",
        }}
        tw="bg-white dark:bg-black top-0 right-0 left-0 z-50 h-16 flex-row items-center justify-between px-4 py-2 shadow-sm"
      >
        <View tw="items-start">
          <Link href="/">
            <HeaderCenter {...{ isDark, isMdWidth }} />
          </Link>
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

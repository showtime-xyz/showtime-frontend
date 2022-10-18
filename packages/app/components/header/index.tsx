import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowLeft, Plus, Search } from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

// import { NetworkButton } from "app/components/connect-button";
import { HeaderDropdown } from "app/components/header-dropdown";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import {
  ShowtimeTabBarIcon,
  TrendingTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { breakpoints } from "design-system/theme";

import { NotificationsInHeader, SearchInHeader } from "./header";

export * from "./header";
type HeaderLeftProps = {
  canGoBack: boolean;
  withBackground?: boolean;
  color?: string;
};
export const HeaderLeft = ({
  canGoBack,
  withBackground = false,
  color,
}: HeaderLeftProps) => {
  const isDark = useIsDarkMode();
  const router = useRouter();
  const Icon = canGoBack ? ArrowLeft : Search;

  return (
    <PressableScale
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        {
          height: 32,
          width: 32,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 999,
        },
        withBackground && { backgroundColor: "rgba(0,0,0,.3)" },
      ]}
      onPress={() => {
        if (canGoBack) {
          router.pop();
        } else {
          router.push("/search");
        }
      }}
    >
      <Icon
        color={
          color ? color : withBackground ? "#FFF" : isDark ? "#FFF" : "#000"
        }
        width={24}
        height={24}
      />
    </PressableScale>
  );
};
export const HeaderCenter = ({
  isDark,
  isMdWidth,
}: {
  isDark?: boolean;
  isMdWidth?: boolean;
}) => {
  return (
    <View tw="flex flex-row">
      <ShowtimeTabBarIcon color={isDark ? "black" : "white"} tw="mr-4" />
      {isMdWidth ? <SearchInHeader /> : null}
    </View>
  );
};
export const HeaderRight = () => {
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

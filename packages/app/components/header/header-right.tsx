import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Plus } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { HeaderDropdown } from "app/components/header-dropdown";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import { TrendingTabBarIcon } from "app/navigation/tab-bar-icons";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { breakpoints } from "design-system/theme";

import { NotificationsInHeader } from "./header";

type HeaderRightProps = {
  withBackground?: boolean;
};
export const HeaderRight = ({ withBackground }: HeaderRightProps) => {
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
              <HeaderDropdown
                type={isMdWidth ? "profile" : "settings"}
                withBackground={withBackground}
              />
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
                {withBackground ? (
                  <Pressable
                    onPress={() => {
                      navigateToLogin();
                    }}
                    tw="h-8 items-center justify-center rounded-full bg-black/30 px-4"
                  >
                    <Text tw="text-sm font-semibold text-white">
                      Sign&nbsp;In
                    </Text>
                  </Pressable>
                ) : (
                  <Button
                    onPress={() => {
                      navigateToLogin();
                    }}
                    variant="primary"
                    size="regular"
                    labelTW="font-semibold"
                  >
                    Sign&nbsp;In
                  </Button>
                )}
              </>
            )}
            {/* {Platform.OS === "web" ? <NetworkButton /> : null} */}
          </View>
        </View>
      )}
    </View>
  );
};

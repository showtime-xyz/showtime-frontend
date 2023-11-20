import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { HeaderDropdown } from "app/components/header-dropdown";
import { useUser } from "app/hooks/use-user";
import {
  CreatorChannelsTabBarIcon,
  TrendingTabBarIcon,
} from "app/navigation/tab-bar-icons";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { NotificationsInHeader } from "./header";

type HeaderRightProps = {
  withBackground?: boolean;
};
export const HeaderRight = ({ withBackground }: HeaderRightProps) => {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useUser();
  const isDark = useIsDarkMode();
  const navigateToLogin = useNavigateToLogin();

  return (
    <View>
      {!isLoading && (
        <View tw="flex-row items-center">
          {isAuthenticated && (
            <>
              <View tw="mx-2">
                <CreatorChannelsTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={router.pathname.includes("channels")}
                />
              </View>
              <View tw="mx-2">
                <TrendingTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={
                    router.pathname === "/home" || router.pathname === "/foryou"
                  }
                />
              </View>
              <View tw="mx-2">
                <NotificationsInHeader />
              </View>
            </>
          )}
          <View tw="flex-row items-center md:mx-2">
            {isAuthenticated ? (
              <HeaderDropdown
                type="profile"
                withBackground={withBackground}
                user={user?.data.profile}
              />
            ) : (
              <>
                <View tw="mx-3">
                  <TrendingTabBarIcon
                    color={isDark ? "white" : "black"}
                    focused={router.pathname === "/foryou"}
                  />
                </View>
                <Button
                  onPress={navigateToLogin}
                  variant="primary"
                  size="regular"
                  labelTW="font-semibold"
                >
                  Sign In
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

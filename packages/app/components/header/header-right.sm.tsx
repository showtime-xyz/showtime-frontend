import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { HeaderDropdown } from "app/components/header-dropdown";
import { NotificationsSettingIcon } from "app/components/header/notifications-setting-icon";
import { useUser } from "app/hooks/use-user";
import { SWIPE_LIST_SCREENS } from "app/lib/constants";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { HeaderSearch } from "./header-search";

type HeaderRightProps = {
  withBackground?: boolean;
};
export const HeaderRightSm = ({ withBackground }: HeaderRightProps) => {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useUser();
  const navigateToLogin = useNavigateToLogin();

  if (router.pathname === "/notifications") {
    return <NotificationsSettingIcon />;
  }
  if (router.pathname === "/") {
    return <HeaderSearch />;
  }
  return (
    <View>
      {!isLoading && (
        <View tw="flex-row items-center">
          <View tw="flex-row items-center md:mx-2">
            {isAuthenticated ? (
              <HeaderDropdown
                type="settings"
                withBackground={withBackground}
                user={user?.data.profile}
              />
            ) : withBackground ? (
              <Button
                onPress={navigateToLogin}
                theme={
                  SWIPE_LIST_SCREENS.includes(router.pathname)
                    ? "dark"
                    : undefined
                }
              >
                Sign In
              </Button>
            ) : (
              <Button onPress={navigateToLogin}>Sign In</Button>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Plus } from "@showtime-xyz/universal.icon";
import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { HeaderDropdown } from "app/components/header-dropdown";
import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";
import {
  CreatorChannelsTabBarIcon,
  TrendingTabBarIcon,
} from "app/navigation/tab-bar-icons";

import { NotificationsInHeader } from "./header";

type HeaderRightProps = {
  withBackground?: boolean;
};
export const HeaderRight = ({ withBackground }: HeaderRightProps) => {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useUser();
  const isDark = useIsDarkMode();
  const redirectToDrop = useRedirectToCreateDrop();

  return (
    <View>
      {!isLoading && (
        <View tw="flex-row items-center">
          {isAuthenticated && (
            <>
              <View tw="mx-2">
                <CreatorChannelsTabBarIcon
                  color={isDark ? "white" : "black"}
                  focused={router.pathname === "/creator-channels"}
                  tooltipSide="bottom"
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
              </>
            )}
            {/* {Platform.OS === "web" ? <NetworkButton /> : null} */}
          </View>
        </View>
      )}
    </View>
  );
};

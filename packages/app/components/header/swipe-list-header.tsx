import React, { memo } from "react";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { HeaderLeft } from "./header-left";

export const DEFAULT_HADER_HEIGHT = 44;

export type SwipeListHeaderProps = {
  canGoBack?: boolean;
  tw?: string;
  withBackground?: boolean;
  color?: string;
};

export const SwipeListHeader = memo<SwipeListHeaderProps>(
  function SwipeListHeader({
    tw = "",
    canGoBack,
    withBackground = false,
    color,
  }) {
    const { top } = useSafeAreaInsets();
    const { isAuthenticated } = useUser();

    const navigateToLogin = useNavigateToLogin();
    const router = useRouter();
    const isRootScreen = router.asPath === "/";
    const headerHeight = top + DEFAULT_HADER_HEIGHT;
    return (
      <>
        <View
          tw={["absolute left-5 z-10 flex md:hidden", tw]}
          style={[
            {
              paddingTop: top,
              height: headerHeight,
            },
          ]}
        >
          <HeaderLeft
            canGoBack={canGoBack ?? isRootScreen}
            withBackground={withBackground}
            color={color}
          />
        </View>
        {!isAuthenticated && (
          <Pressable
            onPress={() => {
              navigateToLogin();
            }}
            tw="absolute right-5 z-10 flex h-8 items-center justify-center rounded-full bg-white px-4 md:hidden"
            style={[
              {
                marginTop: top,
              },
            ]}
          >
            <Text tw="text-sm font-semibold text-black">Sign In</Text>
          </Pressable>
        )}
      </>
    );
  }
);
export const NotificationsInHeader = () => <></>;

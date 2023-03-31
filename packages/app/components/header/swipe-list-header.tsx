import React, { memo } from "react";

import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

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
    const router = useRouter();
    const isRootScreen = router.asPath === "/";
    const headerHeight = top + DEFAULT_HADER_HEIGHT;
    return (
      <View
        tw={["absolute left-5 z-10", tw]}
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
    );
  }
);
export const NotificationsInHeader = () => <></>;

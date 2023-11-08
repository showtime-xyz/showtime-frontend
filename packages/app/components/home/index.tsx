import { useRef, useMemo } from "react";
import { useWindowDimensions, Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { TopCreatorTokens } from "app/components/creator-token/top-creator-token";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScrollToTop } from "app/lib/react-navigation/native";
import { Sticky } from "app/lib/stickynode";

import { breakpoints } from "design-system/theme";

import { ListHeaderComponent } from "./header";
import { HomeSlider } from "./home-slider";

const RIGHT_SIDE_WIDTH = 300;
export const Home = () => {
  const bottomBarHeight = usePlatformBottomHeight();

  const listRef = useRef<any>();
  useScrollToTop(listRef);

  return (
    <View
      tw="w-full flex-1 flex-row justify-center bg-white dark:bg-black"
      style={{
        marginBottom: Platform.select({
          native: bottomBarHeight,
        }),
      }}
    >
      <View tw="md:max-w-screen-content w-full">
        <TopCreatorTokens />
      </View>
    </View>
  );
};

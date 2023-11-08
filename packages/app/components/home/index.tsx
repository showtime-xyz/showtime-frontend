import { useRef } from "react";
import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { TopCreatorTokens } from "app/components/creator-token/top-creator-token";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

export const Home = () => {
  const bottomBarHeight = usePlatformBottomHeight();

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

import { Suspense } from "react";
import { Platform } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { SwipeList } from "app/components/swipe-list";
import { useFeed } from "app/hooks/use-feed";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

import { SwipeListHeader } from "./header/swipe-list-header";

export const Feed = () => {
  return (
    <View tw="w-full flex-1" testID="homeFeed">
      <ErrorBoundary>
        <Suspense fallback={<View />}>
          <FeedList />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
};

const FeedList = () => {
  const bottomBarHeight = usePlatformBottomHeight();
  const { data } = useFeed();
  return (
    <View tw="flex-1">
      {Platform.OS !== "web" && (
        <SwipeListHeader canGoBack={false} withBackground />
      )}
      <SwipeList bottomPadding={bottomBarHeight} data={data} />
    </View>
  );
};

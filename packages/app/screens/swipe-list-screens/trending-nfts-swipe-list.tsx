import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { useTrendingNFTS } from "app/hooks/api-hooks";

export const TrendingNFTsSwipeListScreen = withColorScheme(({ route }) => {
  const { days, initialScrollIndex } = route.params;

  const { data, isLoadingMore, isRefreshing, refresh, fetchMore } =
    useTrendingNFTS({
      days,
    });
  const headerHeight = useHeaderHeight();
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <SwipeList
      data={data}
      fetchMore={fetchMore}
      isRefreshing={isRefreshing}
      refresh={refresh}
      isLoadingMore={isLoadingMore}
      initialScrollIndex={initialScrollIndex}
      headerHeight={headerHeight}
      bottomBarHeight={bottomBarHeight}
    />
  );
});

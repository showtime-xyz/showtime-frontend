import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";

export const TrendingCreatorSwipeList = withColorScheme(({ route }) => {
  const { data, initialScrollIndex } = route.params;

  const headerHeight = useHeaderHeight();
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <SwipeList
      data={data}
      initialScrollIndex={initialScrollIndex}
      headerHeight={headerHeight}
      bottomBarHeight={bottomBarHeight}
    />
  );
});

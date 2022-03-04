import { useHeaderHeight } from "@react-navigation/elements";

import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { useProfileNFTs } from "app/hooks/api-hooks";

export const ProfileSwipeListScreen = withColorScheme(({ route }) => {
  const { listId, profileId, collectionId, sortId, initialScrollIndex } =
    route.params;

  const { data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useProfileNFTs({
      listId,
      profileId,
      collectionId,
      sortId,
    });

  const headerHeight = useHeaderHeight();

  return (
    <SwipeList
      data={data}
      fetchMore={fetchMore}
      isRefreshing={isRefreshing}
      refresh={refresh}
      isLoadingMore={isLoadingMore}
      initialScrollIndex={initialScrollIndex}
      headerHeight={headerHeight}
    />
  );
});

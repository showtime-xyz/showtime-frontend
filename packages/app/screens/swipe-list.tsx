import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useProfileNFTs } from "app/hooks/api-hooks";
import { useSafeAreaInsets } from "app/lib/safe-area";

export const SwipeListScreen = withColorScheme(({ route }) => {
  const type = route.params.type;

  switch (type) {
    case "profile":
      return <ProfileSwipeList route={route} />;
    case "trendingNFTs":
      return <TrendingNFTsSwipeList route={route} />;
    case "trendingCreator":
      return <TrendingCreatorSwipeList route={route} />;
    default:
      return null;
  }
});

const ProfileSwipeList = ({ route }: any) => {
  const { listId, profileId, collectionId, sortId, initialScrollIndex } =
    route.params;

  const { data, fetchMore, isRefreshing, refresh, isLoadingMore } =
    useProfileNFTs({
      listId,
      profileId,
      collectionId,
      sortId,
    });
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      data={data}
      fetchMore={fetchMore}
      isRefreshing={isRefreshing}
      refresh={refresh}
      isLoadingMore={isLoadingMore}
      initialScrollIndex={Number(initialScrollIndex)}
      bottomPadding={safeAreaBottom}
    />
  );
};

const TrendingNFTsSwipeList = ({ route }) => {
  const { days, initialScrollIndex } = route.params;

  const { data, isLoadingMore, isRefreshing, refresh, fetchMore } =
    useTrendingNFTS({
      days,
    });
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      data={data}
      fetchMore={fetchMore}
      isRefreshing={isRefreshing}
      refresh={refresh}
      isLoadingMore={isLoadingMore}
      initialScrollIndex={Number(initialScrollIndex)}
      bottomPadding={safeAreaBottom}
    />
  );
};

export const TrendingCreatorSwipeList = withColorScheme(({ route }) => {
  const { data, initialScrollIndex } = route.params;
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      data={data}
      initialScrollIndex={Number(initialScrollIndex)}
      bottomPadding={safeAreaBottom}
    />
  );
});

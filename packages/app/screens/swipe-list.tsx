import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useProfileNFTs } from "app/hooks/api-hooks";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { createParam } from "app/navigation/use-param";

type Query = {
  type: string;
  listId: any;
  profileId: any;
  collectionId: any;
  sortId: any;
  initialScrollIndex: any;
  days: any;
};

export const SwipeListScreen = withColorScheme(({ route }) => {
  const { useParam } = createParam<Query>();
  const [type] = useParam("type");

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
  const { useParam } = createParam<Query>();
  const [listId] = useParam("listId");
  const [profileId] = useParam("profileId");
  const [collectionId] = useParam("collectionId");
  const [sortId] = useParam("sortId");
  const [initialScrollIndex] = useParam("initialScrollIndex");

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

const TrendingNFTsSwipeList = () => {
  const { useParam } = createParam<Query>();
  const [days] = useParam("days");
  const [initialScrollIndex] = useParam("initialScrollIndex");

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
  // TODO: get data from swr instead of route object!
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

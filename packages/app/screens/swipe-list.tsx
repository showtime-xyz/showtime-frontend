import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";

import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { mixpanel } from "app/lib/mixpanel";
import { createParam } from "app/navigation/use-param";

import { useProfileNFTs } from "../hooks/api-hooks";

type Query = {
  type: string;
};

const { useParam } = createParam<Query>();

export const SwipeListScreen = withColorScheme(({ route }) => {
  //   useEffect(() => {
  //     mixpanel.track("Profile view");
  //   }, []);
  const { type } = route.params;

  const getComponent = () => {
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
  };

  return <BottomSheetModalProvider>{getComponent()}</BottomSheetModalProvider>;
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
};

const TrendingNFTsSwipeList = ({ route }) => {
  const { days, initialScrollIndex } = route.params;

  const { data, isLoadingMore, isRefreshing, refresh, fetchMore } =
    useTrendingNFTS({
      days,
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
};

export const TrendingCreatorSwipeList = withColorScheme(({ route }) => {
  const { data, initialScrollIndex } = route.params;

  const headerHeight = useHeaderHeight();

  return (
    <SwipeList
      data={data}
      initialScrollIndex={initialScrollIndex}
      headerHeight={headerHeight}
    />
  );
});

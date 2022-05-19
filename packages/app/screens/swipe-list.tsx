import { useMemo } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { useProfileNFTs } from "app/hooks/api-hooks";
import { useFeed } from "app/hooks/use-feed";
import { useTrackPageViewed } from "app/lib/analytics";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";

type Tab = "following" | "curated" | "" | undefined;

type Query = {
  type: string;
  tab: Tab;
  listId: any;
  profileId: any;
  collectionId: any;
  sortId: any;
  initialScrollIndex: any;
  days: any;
  creatorId: any;
};

export const SwipeListScreen = withColorScheme(() => {
  const { useParam } = createParam<Query>();
  const [type] = useParam("type");
  const [tab] = useParam("tab");
  useTrackPageViewed({ name: "Swipe List", type });

  switch (type) {
    case "profile":
      return <ProfileSwipeList />;
    case "trendingNFTs":
      return <TrendingNFTsSwipeList />;
    case "trendingCreator":
      return <TrendingCreatorSwipeList />;
    case "feed":
      return <FeedSwipeList tab={tab} />;
    default:
      return null;
  }
});

const FeedSwipeList = ({ tab }: { tab: Tab }) => {
  const { useParam } = createParam<Query>();
  const { data, updateItem, fetchMore, isRefreshing, refresh } = useFeed(
    tab ? `/${tab}` : ""
  );
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <MutateProvider mutate={updateItem}>
      <SwipeList
        data={data}
        fetchMore={fetchMore}
        isRefreshing={isRefreshing}
        refresh={refresh}
        initialScrollIndex={Number(initialScrollIndex)}
        bottomPadding={safeAreaBottom}
      />
    </MutateProvider>
  );
};

const ProfileSwipeList = () => {
  const { useParam } = createParam<Query>();
  const [listId] = useParam("listId");
  const [profileId] = useParam("profileId");
  const [collectionId] = useParam("collectionId");
  const [sortId] = useParam("sortId");
  const [initialScrollIndex] = useParam("initialScrollIndex");

  const { data, fetchMore, updateItem, isRefreshing, refresh } = useProfileNFTs(
    {
      listId,
      profileId,
      collectionId,
      sortId,
    }
  );
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <MutateProvider mutate={updateItem}>
      <SwipeList
        data={data}
        fetchMore={fetchMore}
        isRefreshing={isRefreshing}
        refresh={refresh}
        initialScrollIndex={Number(initialScrollIndex)}
        bottomPadding={safeAreaBottom}
      />
    </MutateProvider>
  );
};

const TrendingNFTsSwipeList = () => {
  const { useParam } = createParam<Query>();
  const [days] = useParam("days");
  const [initialScrollIndex] = useParam("initialScrollIndex");

  const { data, updateItem, isRefreshing, refresh, fetchMore } =
    useTrendingNFTS({
      days,
    });
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <MutateProvider mutate={updateItem}>
      <SwipeList
        data={data}
        fetchMore={fetchMore}
        isRefreshing={isRefreshing}
        refresh={refresh}
        initialScrollIndex={Number(initialScrollIndex)}
        bottomPadding={safeAreaBottom}
      />
    </MutateProvider>
  );
};

export const TrendingCreatorSwipeList = withColorScheme(() => {
  const { useParam } = createParam<Query>();
  const [days] = useParam("days");
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const [creatorId] = useParam("creatorId");

  const { data, mutate } = useTrendingCreators({
    days,
  });

  const creatorTopNFTs = useMemo(() => {
    let nfts: NFT[] = [];
    if (data && Array.isArray(data)) {
      const creator = data.find((c) => c.profile_id === Number(creatorId));
      if (creator && creator.top_items) {
        nfts = creator.top_items;
      }
    }
    return nfts;
  }, [data, creatorId]);

  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const updateItem = (_updatedNFT: NFT) => {
    mutate();
  };

  return (
    <MutateProvider mutate={updateItem}>
      <SwipeList
        data={creatorTopNFTs}
        initialScrollIndex={Number(initialScrollIndex)}
        bottomPadding={safeAreaBottom}
        fetchMore={() => {}}
        isRefreshing={false}
        refresh={() => {}}
      />
    </MutateProvider>
  );
});

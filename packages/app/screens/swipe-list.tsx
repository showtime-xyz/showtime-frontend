import { useMemo } from "react";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { useProfileNFTs } from "app/hooks/api-hooks";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";
import { NFT } from "app/types";

type Tab = "following" | "curated" | "" | undefined;

type Query = {
  type: string;
  tab: Tab;
  tabType: string;
  profileId: any;
  collectionId: any;
  sortType: string;
  initialScrollIndex: any;
  days: string;
  creatorId: any;
};

export const SwipeListScreen = withColorScheme(() => {
  const { useParam } = createParam<Query>();
  const [type] = useParam("type");

  switch (type) {
    case "profile":
      return <ProfileSwipeList type={type} />;
    case "trendingNFTs":
      return <TrendingNFTsSwipeList type={type} />;
    case "trendingCreator":
      return <TrendingCreatorSwipeList type={type} />;
    case "feed":
      return <FeedSwipeList type={type} />;
    default:
      return null;
  }
});

const FeedSwipeList = ({ type }: { type: string }) => {
  const { useParam } = createParam<Query>();
  const { data } = useFeed();
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      data={data}
      type={type}
      initialScrollIndex={Number(initialScrollIndex)}
      bottomPadding={safeAreaBottom}
    />
  );
};

const ProfileSwipeList = ({ type }: { type: string }) => {
  const { useParam } = createParam<Query>();
  const [tabType] = useParam("tabType");
  const [profileId] = useParam("profileId");
  const [collectionId] = useParam("collectionId");
  const [sortType] = useParam("sortType");
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const { user } = useUser();
  const queryParams = useMemo(
    () => ({
      tabType,
      profileId,
      collectionId,
      sortType,
      type,
      initialScrollIndex,
    }),
    [tabType, profileId, collectionId, sortType, type, initialScrollIndex]
  );

  const { data, fetchMore, updateItem, isRefreshing, refresh } = useProfileNFTs(
    {
      tabType,
      profileId,
      collectionId,
      sortType,
    }
  );
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <MutateProvider mutate={updateItem}>
      <ProfileTabsNFTProvider
        tabType={
          user?.data?.profile?.profile_id?.toString() === profileId
            ? tabType
            : undefined
        }
      >
        <SwipeList
          data={data}
          fetchMore={fetchMore}
          isRefreshing={isRefreshing}
          queryParams={queryParams}
          refresh={refresh}
          initialScrollIndex={Number(initialScrollIndex)}
          bottomPadding={safeAreaBottom}
        />
      </ProfileTabsNFTProvider>
    </MutateProvider>
  );
};

const TrendingNFTsSwipeList = ({ type }: { type: string }) => {
  const { useParam } = createParam<Query>();
  const [days] = useParam("days");
  const [initialScrollIndex] = useParam("initialScrollIndex");

  const { data } = useTrendingNFTS({
    days: Number(days),
  });
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      data={data}
      // fetchMore={fetchMore}
      // isRefreshing={isRefreshing}
      // refresh={refresh}
      initialScrollIndex={Number(initialScrollIndex)}
      type={type}
      bottomPadding={safeAreaBottom}
    />
  );
};

export const TrendingCreatorSwipeList = withColorScheme(
  ({ type }: { type: string }) => {
    const { useParam } = createParam<Query>();
    const [days] = useParam("days");
    const [initialScrollIndex] = useParam("initialScrollIndex");
    const [creatorId] = useParam("creatorId");

    const { data, mutate } = useTrendingCreators({
      days: Number(days),
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
    const updateItem = () => {
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
          type={type}
        />
      </MutateProvider>
    );
  }
);

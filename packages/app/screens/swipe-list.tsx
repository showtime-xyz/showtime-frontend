import { Platform } from "react-native";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { SwipeListHeader } from "app/components/header/swipe-list-header";
import { withColorScheme } from "app/components/memo-with-theme";
import { SwipeList } from "app/components/swipe-list";
import { ProfileTabsNFTProvider } from "app/context/profile-tabs-nft-context";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useProfileNFTs } from "app/hooks/api-hooks";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";
import { MutateProvider } from "app/providers/mutate-provider";

type Tab = "following" | "curated" | "" | undefined;

type Query = {
  type: string;
  tab: Tab;
  tabType: string;
  profileId: any;
  collectionId: any;
  sortType: string;
  initialScrollIndex: any;
  filter: string;
  creatorId: any;
};
export const SwipeListByType = () => {
  const { useParam } = createParam<Query>();
  const [type] = useParam("type");

  switch (type) {
    case "profile":
      return <ProfileSwipeList />;
    case "trendingNFTs":
      return <TrendingNFTsSwipeList />;
    case "feed":
      return <FeedSwipeList />;
    default:
      return null;
  }
};

export const SwipeListScreen = withColorScheme(() => {
  return (
    <View tw="w-full flex-1">
      {Platform.OS !== "web" && <SwipeListHeader canGoBack withBackground />}
      <SwipeListByType />
    </View>
  );
});

const FeedSwipeList = () => {
  const { useParam } = createParam<Query>();
  const { data } = useFeed();
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  return (
    <SwipeList
      data={data}
      initialScrollIndex={Number(initialScrollIndex)}
      bottomPadding={safeAreaBottom}
    />
  );
};

const ProfileSwipeList = () => {
  const { useParam } = createParam<Query>();
  const [tabType] = useParam("tabType");
  const [profileId] = useParam("profileId");
  const [collectionId] = useParam("collectionId");
  const [sortType] = useParam("sortType");
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const { user } = useUser();

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
          refresh={refresh}
          initialScrollIndex={Number(initialScrollIndex)}
          bottomPadding={safeAreaBottom}
        />
      </ProfileTabsNFTProvider>
    </MutateProvider>
  );
};

const TrendingNFTsSwipeList = () => {
  const { useParam } = createParam<Query>();
  const [filter] = useParam("filter");
  const [initialScrollIndex] = useParam("initialScrollIndex");
  const { data } = useTrendingNFTS({
    filter,
  });
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      data={data}
      // fetchMore={fetchMore}
      // isRefreshing={isRefreshing}
      // refresh={refresh}
      initialScrollIndex={Number(initialScrollIndex)}
      bottomPadding={safeAreaBottom}
    />
  );
};

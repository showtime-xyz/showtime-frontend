import { Suspense, useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Card } from "app/components/card";
import { CreatorPreview } from "app/components/creator-preview";
import { ErrorBoundary } from "app/components/error-boundary";
import { TRENDING_ROUTE } from "app/components/trending";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { createParam } from "app/navigation/use-param";

import { IndependentTabBar } from "design-system/tab-view/independent-tab-bar";
import { breakpoints, CARD_DARK_SHADOW } from "design-system/theme";

type Query = {
  tab: string;
  days: number;
};

const { useParam } = createParam<Query>();

export const Trending = () => {
  const [tab, setTab] = useParam("tab");
  // const isDark = useIsDarkMode();
  const selected = tab === "creator" ? 1 : 0;

  // const handleTabChange = useCallback(
  //   (index: number) => {
  //     Haptics.impactAsync();
  //     if (index === 0) {
  //       setTab("nft");
  //     } else {
  //       setTab("creator");
  //     }
  //   },
  //   [setTab]
  // );
  const [days, setDays] = useParam("days", {
    initial: 1,
    parse: (value) => Number(value ?? 1),
  });

  const handleDaysChange = useCallback(
    (index: number) => {
      if (index === 0) {
        setDays(1);
      } else if (index === 1) {
        setDays(7);
      } else {
        setDays(30);
      }
    },
    [setDays]
  );

  const index = days === 1 ? 0 : days === 7 ? 1 : 2;
  return (
    <View tw="w-full max-w-screen-xl bg-gray-100 dark:bg-black">
      <View tw="mx-auto w-[90%] py-8">
        <View tw="flex-row items-center justify-between pb-8">
          <View>
            <Text tw="font-space-bold text-2xl text-black dark:text-white">
              Trending
            </Text>
          </View>
          {/* <View
            tw="w-[400px] rounded-lg bg-white p-4 shadow-lg dark:bg-black"
            style={{
              // @ts-ignore
              boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
            }}
          >
            <SegmentedControl
              values={["NFT", "CREATOR"]}
              onChange={handleTabChange}
              selectedIndex={selected}
            />
          </View> */}
        </View>
        {/* <TrendingTabs selectedTab={selected === 0 ? "nft" : "creator"} /> */}
        <IndependentTabBar
          onPress={(i) => {
            handleDaysChange(i);
          }}
          routes={TRENDING_ROUTE}
          index={index}
        />
        <ErrorBoundary>
          <Suspense
            fallback={
              <View tw="mt-10 items-center justify-center">
                <Spinner size="small" />
              </View>
            }
          >
            <List
              days={days}
              selectedTab={selected === 0 ? "nft" : "creator"}
            />
          </Suspense>
        </ErrorBoundary>
      </View>
    </View>
  );
};

const List = ({
  days,
  selectedTab,
}: {
  days: number;
  selectedTab: "creator" | "nft";
}) => {
  if (selectedTab === "creator") {
    return <CreatorsList days={days} />;
  }

  return <NFTList days={days} />;
};

const CreatorsList = ({ days }: { days: any }) => {
  const { data, isLoading } = useTrendingCreators({
    days,
  });

  const router = useRouter();

  const [containerWidth, setContainerWidth] = useState(0);
  const isDark = useIsDarkMode();

  return (
    <View
      tw="mt-4 flex-1"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {isLoading ? (
        <View tw="mx-auto p-10">
          <Spinner />
        </View>
      ) : null}
      {data?.length > 0 && containerWidth
        ? data.map((item: any) => {
            return (
              <View
                key={item.creator_id}
                tw="mb-8 rounded-lg bg-white dark:bg-black"
                //@ts-ignore
                style={{ boxShadow: isDark ? CARD_DARK_SHADOW : null }}
              >
                <CreatorPreview
                  creator={item}
                  onMediaPress={(initialScrollIndex: number) => {
                    router.push(
                      `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
                    );
                  }}
                  mediaSize={containerWidth / 3 - 2}
                />
              </View>
            );
          })
        : null}
    </View>
  );
};

const NFTList = ({ days }: { days: any }) => {
  const { data, isLoading } = useTrendingNFTS({
    days,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const { width } = useWindowDimensions();

  const numColumns = width >= breakpoints["lg"] ? 3 : 2;

  return (
    <View
      tw="mt-4 flex-1 flex-row flex-wrap justify-between"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {isLoading ? (
        <View tw="mx-auto p-10">
          <Spinner />
        </View>
      ) : null}
      {data?.length > 0 && containerWidth
        ? data.map((item, index) => {
            return (
              <Card
                hrefProps={{
                  pathname: `/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`,
                }}
                key={`nft-list-card-${index}`}
                nft={item}
                tw={`w-[${containerWidth / numColumns - 30}px] h-[${
                  containerWidth / numColumns + 167
                }px] mb-8`}
              />
            );
          })
        : null}
    </View>
  );
};

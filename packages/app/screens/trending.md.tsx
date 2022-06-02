import { Suspense, useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { SegmentedControl } from "@showtime-xyz/universal.segmented-control";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { Haptics } from "app/lib/haptics";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { MutateProvider } from "app/providers/mutate-provider";
import { CARD_DARK_SHADOW } from "app/utilities";

import { Card } from "design-system/card";
import { CreatorPreview } from "design-system/creator-preview";
import { Tabs } from "design-system/tabs";
import { breakpoints } from "design-system/theme";

type Query = {
  tab: string;
  days: number;
};

const { useParam } = createParam<Query>();

export const Trending = () => {
  const [tab, setTab] = useParam("tab");
  const isDark = useIsDarkMode();
  const selected = tab === "nft" ? 1 : 0;

  const handleTabChange = useCallback(
    (index: number) => {
      Haptics.impactAsync();
      if (index === 0) {
        setTab("following");
      } else {
        setTab("nft");
      }
    },
    [setTab]
  );

  return (
    <View tw="w-full max-w-screen-xl bg-gray-100 dark:bg-black">
      <View tw="mx-auto w-[90%] py-8">
        <View tw="flex-row items-center justify-between pb-8">
          <View>
            <Text tw="font-space-bold text-2xl text-black dark:text-white">
              Trending
            </Text>
          </View>
          <View
            tw="w-[400px] rounded-lg bg-white p-4 shadow-lg dark:bg-black"
            style={{
              // @ts-ignore
              boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
            }}
          >
            <SegmentedControl
              values={["CREATOR", "NFT"]}
              onChange={handleTabChange}
              selectedIndex={selected}
            />
          </View>
        </View>
        <TrendingTabs selectedTab={selected === 0 ? "creator" : "nft"} />
      </View>
    </View>
  );
};

const TrendingTabs = ({ selectedTab }: { selectedTab: "nft" | "creator" }) => {
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
    <Tabs.Root onIndexChange={handleDaysChange} index={index} lazy>
      <Tabs.List
        scrollEnabled={false}
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{ backgroundColor: "transparent" }}
      >
        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">Today</Text>
        </Tabs.Trigger>

        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">This week</Text>
        </Tabs.Trigger>

        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">This month</Text>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Pager>
        <View tw="flex-1" nativeID="12132323">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
        <View tw="flex-1">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
        <View tw="flex-1">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
      </Tabs.Pager>
    </Tabs.Root>
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
      {data.length > 0 && containerWidth
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
  const { data, updateItem, isLoading } = useTrendingNFTS({
    days,
  });
  const [containerWidth, setContainerWidth] = useState(0);
  const { width } = useWindowDimensions();

  const numColumns = width >= breakpoints["lg"] ? 3 : 2;

  return (
    <MutateProvider mutate={updateItem}>
      <View
        tw="mt-4 flex-1 flex-row flex-wrap justify-between"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {isLoading ? (
          <View tw="mx-auto p-10">
            <Spinner />
          </View>
        ) : null}
        {data.length > 0 && containerWidth
          ? data.map((item, index) => {
              return (
                <Card
                  hrefProps={{
                    pathname: `/nft/${item.chain_name}/${item.contract_address}/${item.token_id}`,
                  }}
                  key={`nft-list-card-${index}`}
                  nft={item}
                  tw={`w-[${containerWidth / numColumns - 30}px] h-[${
                    containerWidth / numColumns + 205
                  }px] mb-8`}
                />
              );
            })
          : null}
      </View>
    </MutateProvider>
  );
};

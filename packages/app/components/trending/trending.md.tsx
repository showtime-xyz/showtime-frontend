import { Suspense, useCallback, useMemo } from "react";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { TRENDING_ROUTE } from "app/components/trending";
import { createParam } from "app/navigation/use-param";

import { IndependentTabBar } from "design-system/tab-view/independent-tab-bar";

import { TrendingCreatorsList } from "./trending-creators-list.md";
import { TrendingNFTSList } from "./trending-nfts-list.md";

type Query = {
  tab: "creator" | "nft";
  days: number;
};

const { useParam } = createParam<Query>();

export const Trending = () => {
  const [tab, setTab] = useParam("tab");
  // const isDark = useIsDarkMode();

  // const handleTabChange = (index: number) => {
  //   Haptics.impactAsync();
  //   setTab(index !== 0 ? "creator" : "nft");
  // };
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
              boxShadow: isDark ? CARD_DARK_SHADOW : CARD_LIGHT_SHADOW,
            }}
          >
            <SegmentedControl
              values={["NFT", "CREATOR"]}
              onChange={handleTabChange}
              selectedIndex={selected}
            />
          </View> */}
        </View>
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
            <List days={days} selectedTab={tab} />
          </Suspense>
        </ErrorBoundary>
      </View>
    </View>
  );
};

export type TrendingMDListProps = {
  days: number;
  selectedTab?: Query["tab"];
};

const LIST_MAP = new Map<Query["tab"], React.FC<TrendingMDListProps>>([
  ["creator", TrendingCreatorsList],
  ["nft", TrendingNFTSList],
]);

const List = ({ selectedTab = "nft", ...rest }: TrendingMDListProps) => {
  const List = useMemo(() => LIST_MAP.get(selectedTab), [selectedTab]);

  if (!List) return null;
  return <List {...rest} />;
};

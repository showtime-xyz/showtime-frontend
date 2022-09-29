import { useCallback, useMemo } from "react";

import { TabBarSingle } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { TRENDING_ROUTE } from "app/components/trending";
import { useContentWidth } from "app/hooks/use-content-width";
import { createParam } from "app/navigation/use-param";

import { TrendingCreatorsList } from "./trending-creators-list.md";
import { TrendingNFTSList } from "./trending-nfts-list.md";

type Query = {
  tab: "creator" | "drop";
  days: number;
};

const { useParam } = createParam<Query>();

export const Trending = () => {
  const [tab] = useParam("tab");
  const contentWidth = useContentWidth();

  // const isDark = useIsDarkMode();

  // const handleTabChange = (index: number) => {
  //   Haptics.impactAsync();
  //   setTab(index !== 0 ? "creator" : "drop");
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
    <View style={{ width: contentWidth }} tw="w-full bg-gray-100 dark:bg-black">
      <View tw="py-8">
        <View tw="flex-row items-center justify-between pb-8">
          <Text tw="font-space-bold px-4 text-2xl text-black dark:text-white">
            Trending
          </Text>
          {/* <View
            tw="w-[400px] rounded-lg bg-white p-4 shadow-lg dark:bg-black dark:shadow-dark shadow-light"
          >
            <SegmentedControl
              values={["DROP", "CREATOR"]}
              onChange={handleTabChange}
              selectedIndex={selected}
            />
          </View> */}
        </View>
        <TabBarSingle
          onPress={(i) => {
            handleDaysChange(i);
          }}
          routes={TRENDING_ROUTE}
          index={index}
        />
        <ErrorBoundary>
          <List days={days} selectedTab={tab} />
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
  ["drop", TrendingNFTSList],
]);

const List = ({ selectedTab = "drop", ...rest }: TrendingMDListProps) => {
  const List = useMemo(() => LIST_MAP.get(selectedTab), [selectedTab]);

  if (!List) return null;
  return <List {...rest} />;
};

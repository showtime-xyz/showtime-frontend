import { forwardRef, Suspense, useContext, useMemo } from "react";

import { TabSpinner } from "@showtime-xyz/universal.tab-view";

import { ErrorBoundary } from "app/components/error-boundary";
import { TabFallback } from "app/components/error-boundary/tab-fallback";
import { TrendingContext } from "app/components/trending/context";

import { CreatorsList } from "./creators-list";
import { NFTSList } from "./nfts-list";

export type TrendingTabListRef = {
  refresh: () => void;
};
export type TrendingTabListProps = {
  days: number;
  index: number;
};
export const TRENDING_ROUTE = [
  {
    title: "Today",
    key: "1",
    index: 0,
  },
  {
    title: "This week",
    key: "7",
    index: 1,
  },
  {
    title: "This month",
    key: "30",
    index: 2,
  },
];

const LIST_MAP = new Map([
  [0, NFTSList],
  [1, CreatorsList],
]);

export const TabListContainer = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function TabListContainer({ days, index }, ref) {
  const selected = useContext(TrendingContext);
  const List = useMemo(() => LIST_MAP.get(selected[index]), [index, selected]);
  return (
    <ErrorBoundary
      renderFallback={(props) => <TabFallback {...props} index={index} />}
    >
      <Suspense fallback={<TabSpinner index={index} />}>
        {List && <List days={days} index={index} ref={ref} />}
      </Suspense>
    </ErrorBoundary>
  );
});

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
  filter: string;
  index: number;
};
export const TRENDING_ROUTE = [
  {
    title: "Music releases",
    key: "music",
    index: 0,
  },
  {
    title: "Digital art",
    key: "art",
    index: 1,
  },
];

const LIST_MAP = new Map([
  [0, NFTSList],
  [1, CreatorsList],
]);

export const TabListContainer = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function TabListContainer({ filter, index }, ref) {
  const selected = useContext(TrendingContext);
  const List = useMemo(() => LIST_MAP.get(selected[index]), [index, selected]);
  return (
    <ErrorBoundary
      renderFallback={(props) => <TabFallback {...props} index={index} />}
    >
      <Suspense fallback={<TabSpinner index={index} />}>
        {List && <List filter={filter} index={index} ref={ref} />}
      </Suspense>
    </ErrorBoundary>
  );
});

import { forwardRef, Suspense } from "react";

import { TabSpinner } from "@showtime-xyz/universal.tab-view";

import { ErrorBoundary } from "app/components/error-boundary";
import { TabFallback } from "app/components/error-boundary/tab-fallback";

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

export const TabListContainer = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function TabListContainer({ filter, index }, ref) {
  return (
    <ErrorBoundary
      renderFallback={(props) => <TabFallback {...props} index={index} />}
    >
      <Suspense fallback={<TabSpinner index={index} />}>
        <NFTSList filter={filter} index={index} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  );
});

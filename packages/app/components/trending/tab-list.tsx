import { forwardRef, Suspense, useContext, useMemo } from "react";

import { ErrorBoundary } from "app/components/error-boundary";

import { TabSpinner } from "design-system/tab-view/tab-spinner";

import { TrendingContext } from "./context";
import { CreatorsList } from "./creators-list";
import { NFTSList } from "./nfts-list";

export type TrendingTabListRef = {
  refresh: () => void;
};
export type TrendingTabListProps = {
  days: number;
  index: number;
};

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
    <ErrorBoundary>
      <Suspense fallback={<TabSpinner index={index} />}>
        {List && <List days={days} index={index} ref={ref} />}
      </Suspense>
    </ErrorBoundary>
  );
});

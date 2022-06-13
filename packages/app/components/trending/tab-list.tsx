import { Suspense, useCallback, useMemo, useState, forwardRef } from "react";

import { SegmentedControl } from "@showtime-xyz/universal.segmented-control";

import { ErrorBoundary } from "app/components/error-boundary";
import { Haptics } from "app/lib/haptics";

import { CreatorsList } from "./creators-list";
import { ListHeader } from "./list-header";
import { NFTSList } from "./nfts-list";

export type TrendingTabListRef = {
  refresh: () => void;
};
export type TrendingTabListProps = {
  days: number;
  SelectionControl?: JSX.Element;
  index: number;
};

export const TabListContainer = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function TabListContainer({ days, index }, ref) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (index: number) => {
      Haptics.impactAsync();
      setSelected(index);
    },
    [setSelected]
  );

  const SelectionControl = useMemo(
    () => (
      <SegmentedControl
        values={["CREATOR", "NFT"]}
        onChange={handleTabChange}
        selectedIndex={selected}
      />
    ),
    [selected, handleTabChange]
  );

  return useMemo(
    () =>
      [
        <ErrorBoundary key="error-boundary-1">
          <Suspense
            fallback={
              <ListHeader
                isLoading={true}
                SelectionControl={SelectionControl}
                length={0}
              />
            }
          >
            <CreatorsList
              days={days}
              index={index}
              SelectionControl={SelectionControl}
              ref={ref}
            />
          </Suspense>
        </ErrorBoundary>,
        <ErrorBoundary key="error-boundary-2">
          <Suspense
            fallback={
              <ListHeader
                isLoading={true}
                SelectionControl={SelectionControl}
                length={0}
              />
            }
          >
            <NFTSList
              days={days}
              index={index}
              SelectionControl={SelectionControl}
              ref={ref}
            />
          </Suspense>
        </ErrorBoundary>,
      ][selected],
    [SelectionControl, days, index, ref, selected]
  );
});

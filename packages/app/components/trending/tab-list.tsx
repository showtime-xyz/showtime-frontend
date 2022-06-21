import { forwardRef, Suspense, useContext } from "react";
import { ViewStyle } from "react-native";

import { View } from "@showtime-xyz/universal.view";

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
const getTabListStyle = (condition: boolean): ViewStyle => ({
  display: condition ? "flex" : "none",
  flex: 1,
});
// Todo: lazy load NFTSLIST
export const TabListContainer = forwardRef<
  TrendingTabListRef,
  TrendingTabListProps
>(function TabListContainer({ days, index }, ref) {
  const selected = useContext(TrendingContext);
  return (
    <ErrorBoundary>
      <Suspense fallback={<TabSpinner index={index} />}>
        <View style={getTabListStyle(selected[index] === 0)}>
          <CreatorsList days={days} index={index} ref={ref} />
        </View>
        <View style={getTabListStyle(selected[index] === 1)}>
          <NFTSList days={days} index={index} ref={ref} />
        </View>
      </Suspense>
    </ErrorBoundary>
  );
});

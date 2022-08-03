import React from "react";
import { FlatList, FlatListProps } from "react-native";

import type { VirtuosoGridProps } from "react-virtuoso";

export type InfiniteScrollListProps<T> = FlatListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll">;

export function RNFlatList<T>(props: InfiniteScrollListProps<T>, ref: any) {
  return <FlatList {...props} ref={ref} />;
}

export const InfiniteScrollList = React.forwardRef(RNFlatList) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlatList<T>>;
  }
) => React.ReactElement;

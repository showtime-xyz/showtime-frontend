import { FlatList, FlatListProps } from "react-native";

import type { VirtuosoGridProps } from "react-virtuoso";

export type InfiniteScrollListProps<T> = FlatListProps<T> &
  Pick<VirtuosoGridProps, "overscan">;

export function InfiniteScrollList<T>(props: InfiniteScrollListProps<T>) {
  return <FlatList {...props} />;
}

import React from "react";

import { FlashList, FlashListProps } from "@shopify/flash-list";
import type { VirtuosoGridProps } from "react-virtuoso";

import { View } from "@showtime-xyz/universal.view";

export type InfiniteScrollListProps<T> = FlashListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll">;

export function RNFlatList<T>(
  { style, ...props }: InfiniteScrollListProps<T>,
  ref: any
) {
  return (
    <View style={style} tw="h-full">
      <FlashList {...props} style={style} ref={ref} />
    </View>
  );
}

export const InfiniteScrollList = React.forwardRef(RNFlatList) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashList<T>>;
  }
) => React.ReactElement;

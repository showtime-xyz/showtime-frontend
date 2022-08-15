import React from "react";

import {
  FlashList as FlashListCore,
  FlashListProps,
} from "@shopify/flash-list";
import type { VirtuosoGridProps } from "react-virtuoso";

import { View } from "@showtime-xyz/universal.view";

export type InfiniteScrollListProps<T> = FlashListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll"> & {
    index?: number;
  };

export function FlashList<T>(
  { style, ...props }: InfiniteScrollListProps<T>,
  ref: any
) {
  return (
    <View style={style} tw="h-full">
      <FlashListCore {...props} ref={ref} />
    </View>
  );
}

export const InfiniteScrollList = React.forwardRef(FlashList) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashListCore<T>>;
  }
) => React.ReactElement;

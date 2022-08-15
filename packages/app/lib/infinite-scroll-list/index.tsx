import React from "react";

import {
  FlashList as FlashListCore,
  FlashListProps,
} from "@shopify/flash-list";
import type { VirtuosoGridProps } from "react-virtuoso";

import { View } from "@showtime-xyz/universal.view";

export type InfiniteScrollListProps<T> = FlashListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll">;

export function FlashList<T>(
  { style, ...props }: InfiniteScrollListProps<T>,
  ref: any
) {
  if (style) {
    return (
      <View style={style} tw="h-full">
        <FlashListCore {...props} ref={ref} />
      </View>
    );
  } else {
    return <FlashListCore {...props} ref={ref} />;
  }
}

export const InfiniteScrollList = React.forwardRef(FlashList) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashListCore<T>>;
  }
) => React.ReactElement;

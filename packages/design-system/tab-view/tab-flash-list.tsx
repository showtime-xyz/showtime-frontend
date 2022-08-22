import React from "react";

import { FlashList } from "@shopify/flash-list";

import type { TabScrollViewProps } from "@showtime-xyz/universal.collapsible-tab-view";
import {
  InfiniteScrollList,
  InfiniteScrollListProps,
} from "@showtime-xyz/universal.infinite-scroll-list";

import { TabFlashListScrollView } from "./tab-flash-list-scroll-view";

export type TabInfiniteScrollListProps<T> = Omit<
  InfiniteScrollListProps<T>,
  "renderScrollComponent"
> & {
  index: number;
  renderScrollComponent?: React.ForwardRefExoticComponent<TabScrollViewProps>;
};

function TabInfiniteScrollListComponent<T>(
  props: TabInfiniteScrollListProps<T>,
  ref: React.Ref<FlashList<T>>
) {
  return (
    <InfiniteScrollList
      {...props}
      renderScrollComponent={TabFlashListScrollView as any}
      ref={ref}
    />
  );
}
export const TabInfiniteScrollList = React.forwardRef(
  TabInfiniteScrollListComponent
) as <T>(
  props: TabInfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashList<T>>;
  }
) => React.ReactElement;

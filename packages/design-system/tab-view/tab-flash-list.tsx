import React from "react";

import { FlashList } from "@shopify/flash-list";

import {
  InfiniteScrollList,
  InfiniteScrollListProps,
} from "@showtime-xyz/universal.infinite-scroll-list";

import type { TabScrollViewProps } from "design-system/tab-view-core";

export type TabInfiniteScrollListProps<T> = Omit<
  InfiniteScrollListProps<T>,
  "renderScrollComponent"
> & {
  index: number;
  renderScrollComponent?: React.ForwardRefExoticComponent<TabScrollViewProps>;
};

export const TabInfiniteScrollList = InfiniteScrollList as <T>(
  props: TabInfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashList<T>>;
  }
) => React.ReactElement;

import React from "react";
import { Platform } from "react-native";

import { FlashList } from "@shopify/flash-list";

import { useHeaderTabContext } from "@showtime-xyz/universal.collapsible-tab-view";
import {
  InfiniteScrollListV2,
  InfiniteScrollListProps,
} from "@showtime-xyz/universal.infinite-scroll-list";

import { TabFlashListScrollView } from "./tab-flash-list-scroll-view";

export type TabInfiniteScrollListProps<T> = Omit<
  InfiniteScrollListProps<T>,
  "renderScrollComponent"
> & {
  index: number;
};

function TabInfiniteScrollListComponent<T>(
  props: TabInfiniteScrollListProps<T>,
  ref: React.Ref<FlashList<T>>
) {
  const { scrollViewPaddingTop } = useHeaderTabContext();
  return (
    <InfiniteScrollListV2
      {...props}
      {...Platform.select({
        web: {},
        default: { renderScrollComponent: TabFlashListScrollView as any },
      })}
      contentContainerStyle={{ paddingTop: scrollViewPaddingTop }}
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

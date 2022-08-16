import React, { useCallback } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import {
  FlashList as FlashListCore,
  FlashListProps,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import type { VirtuosoGridProps } from "react-virtuoso";

export type InfiniteScrollListProps<T> = FlashListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll"> & {
    index?: number;
    gridItemProps?: ViewProps;
  };

export function FlashList<T>(
  {
    style,
    renderItem: propRenderItem,
    gridItemProps,
    ...rest
  }: InfiniteScrollListProps<T>,
  ref: any
) {
  const renderItem = useCallback(
    (props: ListRenderItemInfo<T>) => {
      if (!propRenderItem) return null;
      if (gridItemProps) {
        return <View {...gridItemProps}>{propRenderItem(props)}</View>;
      } else {
        return propRenderItem(props);
      }
    },
    [gridItemProps, propRenderItem]
  );

  return (
    <View style={StyleSheet.flatten([{ height: "100%" }, style])}>
      <FlashListCore {...rest} ref={ref} renderItem={renderItem} />
    </View>
  );
}

export const InfiniteScrollList = React.forwardRef(FlashList) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashListCore<T>>;
  }
) => React.ReactElement;

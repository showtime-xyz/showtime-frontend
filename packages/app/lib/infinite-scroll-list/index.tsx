import React, { useCallback } from "react";
import { View, ViewProps, StyleSheet } from "react-native";

import {
  FlashList as FlashListCore,
  FlashListProps,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import type { VirtuosoGridProps } from "react-virtuoso";

export type InfiniteScrollListProps<T> = FlashListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll"> & {
    index?: number;
    /**
     * grid layout item view props, it only valid if numColumns > 1
     */
    gridItemProps?: ViewProps | null;
  };

export function FlashList<T>(
  {
    style,
    renderItem: propRenderItem,
    numColumns,
    gridItemProps,
    ...rest
  }: InfiniteScrollListProps<T>,
  ref: any
) {
  const renderItem = useCallback(
    (props: ListRenderItemInfo<T>) => {
      if (!propRenderItem) return null;
      if (gridItemProps && numColumns && numColumns > 1) {
        return <View {...gridItemProps}>{propRenderItem(props)}</View>;
      } else {
        return propRenderItem(props);
      }
    },
    [gridItemProps, numColumns, propRenderItem]
  );
  if (style) {
    return (
      <View style={StyleSheet.flatten([{ height: "100%" }, style])}>
        <FlashListCore
          {...rest}
          numColumns={numColumns}
          ref={ref}
          renderItem={renderItem}
        />
      </View>
    );
  } else {
    return (
      <FlashListCore
        {...rest}
        numColumns={numColumns}
        renderItem={renderItem}
        ref={ref}
      />
    );
  }
}

export const InfiniteScrollList = React.forwardRef(FlashList) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashListCore<T>>;
  }
) => React.ReactElement;

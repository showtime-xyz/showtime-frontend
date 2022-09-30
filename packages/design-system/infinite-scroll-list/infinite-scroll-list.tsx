import React, { useCallback, ComponentType } from "react";
import { View, ViewProps } from "react-native";

import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
} from "@shopify/flash-list";
import type { VirtuosoGridProps } from "react-virtuoso";

export type InfiniteScrollListProps<T> = FlashListProps<T> &
  Pick<VirtuosoGridProps, "overscan" | "useWindowScroll"> & {
    index?: number;
    /**
     * Grid layout item view props, only valid when numColumns > 1
     * @default undefined
     */
    gridItemProps?: ViewProps | null;
    // override this type, avoid some style code that cause the web to be re-rendered.
    ListHeaderComponent?: ComponentType<{
      context?: unknown;
    }>;
    ListFooterComponent?: ComponentType<{
      context?: unknown;
    }>;
  };

function FlashListComponent<T>(
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
      <View style={[{ height: "100%" }, style]}>
        <FlashList
          {...rest}
          numColumns={numColumns}
          ref={ref}
          renderItem={renderItem}
        />
      </View>
    );
  } else {
    return (
      <FlashList
        {...rest}
        numColumns={numColumns}
        renderItem={renderItem}
        ref={ref}
      />
    );
  }
}

export const InfiniteScrollList = React.forwardRef(FlashListComponent) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashList<T>>;
  }
) => React.ReactElement;

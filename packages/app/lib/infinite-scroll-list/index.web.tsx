import React, { CSSProperties, useMemo } from "react";
import { FlatListProps } from "react-native";

import {
  VirtuosoGrid,
  VirtuosoGridProps,
  GridItem,
  GridListProps,
  GridComponents,
} from "react-virtuoso";

import { isReactComponent } from "app/utilities";

export type InfiniteScrollListProps<T> = Omit<
  FlatListProps<T>,
  "onEndReached"
> & {
  onEndReached?: VirtuosoGridProps["endReached"];
};

const ListContainer = React.forwardRef(function ListContainer(
  props: GridListProps,
  ref: React.LegacyRef<HTMLDivElement>
) {
  return (
    <div
      {...props}
      style={{ ...props.style, display: "flex", flexWrap: "wrap" }}
      ref={ref}
    />
  );
});

type ItemContainerProps = GridItem & {
  style?: CSSProperties;
  numColumns?: number;
};

const ItemContainer = React.forwardRef(function ItemContainer(
  props: ItemContainerProps,
  ref: React.LegacyRef<HTMLDivElement>
) {
  const width = props.numColumns ? `${100 / props.numColumns}%` : "100%";
  return <div {...props} style={{ ...props.style, width }} ref={ref} />;
});

export function InfiniteScrollList<T extends any>({
  renderItem,
  data,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  ListEmptyComponent,
  numColumns,
}: InfiniteScrollListProps<T>) {
  const renderItemContent = React.useCallback(
    (index: number) => {
      if (data && data[index]) {
        const element = renderItem?.({
          item: data[index],
          index,
          separators: {
            highlight: () => false,
            unhighlight: () => false,
            updateProps: () => false,
          },
        });
        return (
          <>
            {element}
            {index < data.length - 1 &&
              ItemSeparatorComponent &&
              isReactComponent(ItemSeparatorComponent) && (
                <ItemSeparatorComponent />
              )}
          </>
        );
      }

      return null;
    },
    [data, ItemSeparatorComponent, renderItem]
  );

  const components = useMemo<GridComponents<T>>(
    () => ({
      Item: (props: ItemContainerProps) => (
        <ItemContainer {...props} numColumns={numColumns} />
      ),
      List: ListContainer,
    }),
    [numColumns]
  );
  if (data?.length === 0) {
    return ListEmptyComponent;
  }
  return (
    <>
      {React.isValidElement(ListHeaderComponent) && ListHeaderComponent}
      <VirtuosoGrid
        useWindowScroll
        totalCount={data?.length || 0}
        components={components}
        endReached={onEndReached}
        itemContent={renderItemContent}
      />
      {React.isValidElement(ListFooterComponent) && ListFooterComponent}
    </>
  );
}

import React, { CSSProperties, useMemo } from "react";

import { VirtuosoGrid, Virtuoso } from "react-virtuoso";
import type {
  VirtuosoGridProps,
  GridListProps,
  GridComponents,
  GridItem,
} from "react-virtuoso";

import { isReactComponent } from "app/utilities";

import type { InfiniteScrollListProps } from ".";

export type InfiniteScrollListWebProps<T> = Omit<
  InfiniteScrollListProps<T>,
  "onEndReached"
> & {
  onEndReached?: VirtuosoGridProps["endReached"];
};

export function InfiniteScrollList<T extends any>({
  renderItem,
  data,
  onEndReached,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  ListEmptyComponent,
  numColumns = 1,
  overscan,
}: InfiniteScrollListWebProps<T>) {
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

  const gridComponents = useMemo<GridComponents<T>>(
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
      {React.isValidElement(ListHeaderComponent) &&
        numColumns > 1 &&
        ListHeaderComponent}

      {numColumns === 1 ? (
        <Virtuoso
          useWindowScroll
          totalCount={data?.length || 0}
          endReached={onEndReached}
          itemContent={renderItemContent}
          components={{
            Footer: () =>
              React.isValidElement(ListFooterComponent)
                ? ListFooterComponent
                : null,
            Header: () =>
              React.isValidElement(ListHeaderComponent)
                ? ListHeaderComponent
                : null,
          }}
          overscan={overscan}
        />
      ) : (
        <VirtuosoGrid
          useWindowScroll
          totalCount={data?.length || 0}
          components={gridComponents}
          endReached={onEndReached}
          itemContent={renderItemContent}
          overscan={overscan}
        />
      )}
      {React.isValidElement(ListFooterComponent) &&
        numColumns > 1 &&
        ListFooterComponent}
    </>
  );
}

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

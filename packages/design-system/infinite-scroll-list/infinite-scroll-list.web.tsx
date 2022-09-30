import React, {
  CSSProperties,
  useMemo,
  useRef,
  useEffect,
  useState,
  MutableRefObject,
} from "react";

import type { FlashListProps, ViewToken } from "@shopify/flash-list";
import type {
  GridListProps,
  GridItem,
  VirtuosoHandle,
  VirtuosoGridProps,
  VirtuosoGridHandle,
  GridComponents,
} from "react-virtuoso";
import { VirtuosoGrid, Virtuoso } from "react-virtuoso";

import type { InfiniteScrollListProps } from ".";

const DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE = 80;

export type InfiniteScrollListWebProps<T> = Omit<
  InfiniteScrollListProps<T>,
  "onEndReached"
> & {
  onEndReached?: VirtuosoGridProps["endReached"];
  onViewableItemsChanged?: FlashListProps<T>["onViewableItemsChanged"];
  gridItemProps?: React.HTMLAttributes<HTMLDivElement>;
};

const renderComponent = (Component: any) => {
  if (!Component) return null;
  if (React.isValidElement(Component)) return Component;
  return <Component />;
};

const ViewabilityTracker = ({
  index,
  item,
  children,
  onViewableItemsChanged,
  viewableItems,
  itemVisiblePercentThreshold,
}: {
  index: number;
  item: any;
  children: any;
  onViewableItemsChanged: FlashListProps<any>["onViewableItemsChanged"];
  viewableItems: MutableRefObject<ViewToken[]>;
  itemVisiblePercentThreshold: number;
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    // defer with a setTimeout. I think virtuoso might be mounting stuff async so intersection observer doesn't detect item on initial render
    setTimeout(() => {
      if (onViewableItemsChanged) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              if (!viewableItems.current.find((v) => v.index === index))
                viewableItems.current.push({
                  item,
                  index,
                  isViewable: true,
                  key: index.toString(),
                  timestamp: new Date().valueOf(),
                });
            } else {
              viewableItems.current = viewableItems.current.filter(
                (v) => v.index !== index
              );
            }

            viewableItems.current = viewableItems.current.sort((a, b) =>
              a.index && b.index ? a.index - b.index : -1
            );

            onViewableItemsChanged?.({
              viewableItems: viewableItems.current,

              // TODO: implement changed
              changed: [],
            });
          },

          {
            // will trigger intersection callback when item is 70% visible
            threshold: itemVisiblePercentThreshold / 100,
          }
        );

        if (ref.current) observer.observe(ref.current);
      }
    }, 10);

    return () => {
      observer?.disconnect();
    };
  }, [
    onViewableItemsChanged,
    viewableItems,
    index,
    item,
    itemVisiblePercentThreshold,
  ]);

  return <div ref={ref}>{children}</div>;
};

export function VirtuosoListComponent<T>(
  {
    renderItem,
    data,
    onEndReached,
    ListHeaderComponent,
    ListFooterComponent,
    ItemSeparatorComponent,
    ListEmptyComponent,
    numColumns = 1,
    overscan,
    useWindowScroll = true,
    style,
    onViewableItemsChanged,
    gridItemProps = {},
    viewabilityConfig,
    estimatedItemSize,
  }: InfiniteScrollListWebProps<T>,
  ref: React.Ref<VirtuosoHandle> | React.Ref<VirtuosoGridHandle>
) {
  const viewableItems = useRef<ViewToken[]>([]);
  const [listItemHeight, setListItemHeight] = useState(0);

  const renderItemContent = React.useCallback(
    (index: number) => {
      if (data && data[index]) {
        const element = renderItem?.({
          item: data[index],
          index,
          target: "Cell",
        });
        return (
          <ViewabilityTracker
            index={index}
            itemVisiblePercentThreshold={
              viewabilityConfig?.itemVisiblePercentThreshold ??
              DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE
            }
            item={data[index]}
            viewableItems={viewableItems}
            onViewableItemsChanged={onViewableItemsChanged}
          >
            {element}
            {index < data.length - 1 && renderComponent(ItemSeparatorComponent)}
          </ViewabilityTracker>
        );
      }

      return null;
    },
    [
      data,
      ItemSeparatorComponent,
      renderItem,
      onViewableItemsChanged,
      viewabilityConfig?.itemVisiblePercentThreshold,
    ]
  );

  const gridComponents = useMemo(
    () => ({
      Item: (props: ItemContainerProps) => (
        <ItemContainer
          {...props}
          numColumns={numColumns}
          ItemSeparatorComponent={ItemSeparatorComponent}
          {...(gridItemProps as {})}
        />
      ),
      List: ListContainer,
    }),
    [ItemSeparatorComponent, gridItemProps, numColumns]
  );

  let minHeight = 0;
  if (listItemHeight) {
    minHeight = listItemHeight;
  } else if (estimatedItemSize && data) {
    minHeight =
      estimatedItemSize * (numColumns ? data.length / numColumns : data.length);
  }

  return (
    <div
      style={
        useWindowScroll ? { minHeight: `${minHeight}px` } : { height: "100%" }
      }
    >
      {numColumns > 1 && renderComponent(ListHeaderComponent)}
      {numColumns === 1 ? (
        <Virtuoso
          useWindowScroll={useWindowScroll}
          data={data ?? []}
          defaultItemHeight={estimatedItemSize}
          endReached={onEndReached}
          itemContent={renderItemContent}
          components={{
            Header: ListHeaderComponent,
            Footer: () => renderComponent(ListFooterComponent),
            EmptyPlaceholder: () => renderComponent(ListEmptyComponent),
          }}
          overscan={overscan}
          style={style as CSSProperties}
          totalListHeightChanged={setListItemHeight}
          ref={ref as React.Ref<VirtuosoHandle>}
        />
      ) : (
        <VirtuosoGrid
          useWindowScroll={useWindowScroll}
          totalCount={data?.length || 0}
          components={gridComponents as GridComponents<T>}
          endReached={onEndReached}
          itemContent={renderItemContent}
          overscan={overscan}
          style={style as CSSProperties}
          ref={ref as React.Ref<VirtuosoGridHandle>}
        />
      )}
      {numColumns > 1 && renderComponent(ListFooterComponent)}
    </div>
  );
}
export const InfiniteScrollList = React.forwardRef(VirtuosoListComponent);

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

type ItemContainerProps = GridItem &
  Pick<FlashListProps<any>, "ItemSeparatorComponent"> & {
    style?: CSSProperties;
    numColumns?: number;
    children?: JSX.Element;
  } & React.HTMLAttributes<HTMLDivElement>;

const ItemContainer = React.forwardRef(function ItemContainer(
  { style, ...rest }: ItemContainerProps,
  ref: React.LegacyRef<HTMLDivElement>
) {
  const width = rest.numColumns ? `${100 / rest.numColumns}%` : "100%";
  return (
    <div {...rest} style={{ ...style, width }} ref={ref}>
      {rest.children}
      {renderComponent(rest.ItemSeparatorComponent)}
    </div>
  );
});

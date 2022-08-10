import React, {
  CSSProperties,
  useMemo,
  useRef,
  useEffect,
  MutableRefObject,
} from "react";
import { FlatListProps, ViewToken } from "react-native";

import { VirtuosoGrid, Virtuoso } from "react-virtuoso";
import type {
  GridListProps,
  GridComponents,
  GridItem,
  VirtuosoHandle,
  VirtuosoGridProps,
  VirtuosoGridHandle,
} from "react-virtuoso";

import { isReactComponent } from "app/utilities";

import type { InfiniteScrollListProps } from ".";

const ioConfiguration = {
  // will trigger intersection callback when item is 70% visible
  threshold: 0.7,
};

export type InfiniteScrollListWebProps<T> = Omit<
  InfiniteScrollListProps<T>,
  "onEndReached"
> & {
  onEndReached?: VirtuosoGridProps["endReached"];
  onViewableItemsChanged?: FlatListProps<any>["onViewableItemsChanged"];
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
}: {
  index: number;
  item: any;
  children: any;
  onViewableItemsChanged: FlatListProps<any>["onViewableItemsChanged"];
  viewableItems: MutableRefObject<ViewToken[]>;
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (onViewableItemsChanged) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (!viewableItems.current.find((v) => v.index === index))
            viewableItems.current.push({
              item,
              index,
              isViewable: true,
              key: index.toString(),
            });
        } else {
          viewableItems.current = viewableItems.current.filter(
            (v) => v.index !== index
          );
        }

        onViewableItemsChanged?.({
          viewableItems: viewableItems.current,

          // TODO: implement changed
          changed: [],
        });
      }, ioConfiguration);

      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [onViewableItemsChanged, viewableItems, index, item]);

  return <div ref={ref}>{children}</div>;
};

export function VirtuosoList<T>(
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
  }: InfiniteScrollListWebProps<T>,
  ref: React.Ref<VirtuosoHandle> | React.Ref<VirtuosoGridHandle>
) {
  const viewableItems = useRef<ViewToken[]>([]);

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
          <ViewabilityTracker
            index={index}
            item={data[index]}
            viewableItems={viewableItems}
            onViewableItemsChanged={onViewableItemsChanged}
          >
            {element}
            {index < data.length - 1 &&
              ItemSeparatorComponent &&
              isReactComponent(ItemSeparatorComponent) && (
                <ItemSeparatorComponent />
              )}
          </ViewabilityTracker>
        );
      }

      return null;
    },
    [data, ItemSeparatorComponent, renderItem, onViewableItemsChanged]
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
          useWindowScroll={useWindowScroll}
          data={data ?? []}
          endReached={onEndReached}
          itemContent={renderItemContent}
          components={{
            Header: () => renderComponent(ListHeaderComponent),
            Footer: () => renderComponent(ListFooterComponent),
          }}
          overscan={overscan}
          style={style as CSSProperties}
          ref={ref as React.Ref<VirtuosoHandle>}
        />
      ) : (
        <VirtuosoGrid
          useWindowScroll={useWindowScroll}
          totalCount={data?.length || 0}
          components={gridComponents}
          endReached={onEndReached}
          itemContent={renderItemContent}
          overscan={overscan}
          style={style as CSSProperties}
          ref={ref as React.Ref<VirtuosoGridHandle>}
        />
      )}
      {React.isValidElement(ListFooterComponent) &&
        numColumns > 1 &&
        ListFooterComponent}
    </>
  );
}
export const InfiniteScrollList = React.forwardRef(VirtuosoList as any);

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

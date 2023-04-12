import { useEffect, useRef, MutableRefObject } from "react";

import type { FlashListProps, ViewToken } from "@shopify/flash-list";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

const DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE = 80;

export function InfiniteScrollListV2<Item>(props: FlashListProps<Item>) {
  const {
    data,
    renderItem,
    extraData,
    onViewableItemsChanged,
    viewabilityConfig,
    ItemSeparatorComponent,
    estimatedItemSize,
    onEndReached,
    numColumns = 1,
  } = props;
  let count = data?.length ?? 0;
  if (numColumns) {
    count = Math.ceil(count / numColumns);
  }
  const rowVirtualizer = useWindowVirtualizer({
    count,
    estimateSize: () => estimatedItemSize ?? 0,
  });
  const viewableItems = useRef<ViewToken[]>([]);

  const renderedItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...renderedItems].reverse();
    if (!lastItem) {
      return;
    }

    if (data && lastItem.index >= data.length - 1) {
      onEndReached?.();
    }
  }, [data, onEndReached, renderedItems]);

  return (
    <>
      {renderedItems.map((virtualItem) => {
        return (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {typeof data?.[virtualItem.index] !== "undefined" ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                {data
                  .slice(
                    virtualItem.index * numColumns,
                    virtualItem.index * numColumns + numColumns
                  )
                  .map((item, i) => {
                    const realIndex = virtualItem.index * numColumns + i;
                    return (
                      <ViewabilityTracker
                        key={realIndex}
                        index={realIndex}
                        itemVisiblePercentThreshold={
                          viewabilityConfig?.itemVisiblePercentThreshold ??
                          DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE
                        }
                        item={data[realIndex]}
                        viewableItems={viewableItems}
                        onViewableItemsChanged={onViewableItemsChanged}
                      >
                        {renderItem?.({
                          index: realIndex,
                          item,
                          extraData,
                          target: "Cell",
                        }) ?? null}
                        {realIndex < data.length - 1 &&
                        ItemSeparatorComponent ? (
                          <ItemSeparatorComponent />
                        ) : null}
                      </ViewabilityTracker>
                    );
                  })}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

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
    if (onViewableItemsChanged) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (
              viewableItems.current.findIndex((v) => v.index === index) === -1
            )
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

          viewableItems.current = viewableItems.current.sort(
            (a, b) =>
              //@ts-ignore
              a.index - b.index
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

    return () => {
      observer?.disconnect();
      viewableItems.current = viewableItems.current.filter(
        (v) => v.index !== index
      );
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

import {
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
  isValidElement,
  forwardRef,
} from "react";

import type { FlashListProps, ViewToken } from "@shopify/flash-list";
import {
  useWindowVirtualizer,
  useVirtualizer,
  Virtualizer,
} from "@tanstack/react-virtual";
import { useRouter } from "next/router";

import { useLatestValueRef } from "app/hooks/use-latest-value-ref";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { delay } from "app/utilities";

const DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE = 80;

const renderComponent = (Component: any) => {
  if (!Component) return null;
  if (isValidElement(Component)) return Component;
  return <Component />;
};
function InfiniteScrollListV2Impl<Item>(
  props: FlashListProps<Item> & {
    useWindowScroll?: boolean;
    overscan?: number;
  }
) {
  const {
    data,
    renderItem,
    extraData,
    onViewableItemsChanged,
    viewabilityConfig,
    ItemSeparatorComponent,
    estimatedItemSize,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    onEndReached,
    numColumns = 1,
    style,
    useWindowScroll = true,
  } = props;
  let count = data?.length ?? 0;
  if (numColumns) {
    count = Math.ceil(count / numColumns);
  }

  const viewableItems = useRef<ViewToken[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollMarginOffseRef = useRef<HTMLDivElement>(null);

  const parentOffsetRef = useRef(0);
  const router = useRouter();
  const key = "myapp-scroll-restoration-" + router.asPath;

  useLayoutEffect(() => {
    parentOffsetRef.current = scrollMarginOffseRef.current?.offsetTop ?? 0;
  }, []);
  let rowVirtualizer: Virtualizer<any, any>;
  if (useWindowScroll) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rowVirtualizer = useWindowVirtualizer({
      count,
      estimateSize: () => estimatedItemSize ?? 0,
      scrollMargin: parentOffsetRef.current,
    });
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rowVirtualizer = useVirtualizer({
      count,
      estimateSize: () => estimatedItemSize ?? 0,
      getScrollElement: () => parentRef.current,
      scrollMargin: parentOffsetRef.current,
    });
  }

  const scrollToLastSavedPosition = useStableCallback(async () => {
    const pos = sessionStorage.getItem(key);
    if (pos) {
      const parsedPos = Number(pos);

      const req = requestAnimationFrame(() => {
        if (window.scrollY < parsedPos) {
          window.scrollTo(0, parsedPos);
        } else {
          cancelAnimationFrame(req);
        }
      });

      sessionStorage.removeItem(key);
    }
  });

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

  const scrollOffsetRef = useLatestValueRef<number>(
    rowVirtualizer.scrollOffset
  );

  useEffect(() => {
    scrollToLastSavedPosition();
  }, [scrollToLastSavedPosition]);

  useEffect(() => {
    return () => {
      // save position on unmount
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sessionStorage.setItem(key, scrollOffsetRef.current.toString());
    };
  }, [rowVirtualizer, key, scrollOffsetRef]);

  return (
    <>
      {useWindowScroll && renderComponent(ListHeaderComponent)}
      <div style={{ height: "100%" }}>
        {data?.length === 0 && renderComponent(ListEmptyComponent)}
        <div
          ref={parentRef}
          style={
            !useWindowScroll
              ? {
                  overflowY: "auto",
                  contain: "strict",
                  //@ts-ignore
                  ...style,
                }
              : {}
          }
        >
          {!useWindowScroll && renderComponent(ListHeaderComponent)}
          <div
            ref={scrollMarginOffseRef}
            style={{
              height: rowVirtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${
                  renderedItems[0]?.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {renderedItems.map((virtualItem) => {
                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={rowVirtualizer.measureElement}
                    style={{ width: "100%" }}
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
                            const realIndex =
                              virtualItem.index * numColumns + i;
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
                                  renderComponent(ItemSeparatorComponent)}
                              </ViewabilityTracker>
                            );
                          })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          {!useWindowScroll && renderComponent(ListFooterComponent)}
        </div>
      </div>
      {useWindowScroll && renderComponent(ListFooterComponent)}
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

  return (
    <div style={{ width: "100%" }} ref={ref}>
      {children}
    </div>
  );
};

const InfiniteScrollListV2 = InfiniteScrollListV2Impl;

export { InfiniteScrollListV2 };

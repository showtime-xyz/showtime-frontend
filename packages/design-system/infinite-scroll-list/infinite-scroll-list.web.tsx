import {
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  isValidElement,
} from "react";

import type { FlashListProps, ViewToken } from "@shopify/flash-list";
import {
  useWindowVirtualizer,
  useVirtualizer,
  Virtualizer,
} from "@tanstack/react-virtual";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";

import { useStableCallback } from "app/hooks/use-stable-callback";

const measurementsCache: any = {};

const DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE = 80;

const renderComponent = (Component: any) => {
  if (!Component) return null;
  if (isValidElement(Component)) return Component;
  return <Component />;
};
function InfiniteScrollListImpl<Item>(
  props: FlashListProps<Item> & {
    useWindowScroll?: boolean;
    preserveScrollPosition?: boolean;
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
    overscan,
    style,
    useWindowScroll = true,
    preserveScrollPosition = false,
  } = props;
  let count = data?.length ?? 0;
  if (numColumns) {
    count = Math.ceil(count / numColumns);
  }

  const HeaderComponent = useMemo(
    () => renderComponent(ListHeaderComponent),
    [ListHeaderComponent]
  );
  const FooterComponent = useMemo(
    () => renderComponent(ListFooterComponent),
    [ListFooterComponent]
  );
  const EmptyComponent = useMemo(
    () => renderComponent(ListEmptyComponent),
    [ListEmptyComponent]
  );

  if (HeaderComponent) {
    count += 1;
  }

  if (FooterComponent) {
    count += 1;
  }

  const viewableItems = useRef<ViewToken[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollMarginOffseRef = useRef<HTMLDivElement>(null);

  const parentOffsetRef = useRef(0);
  const router = useRouter();
  const key = `myapp-scroll-restoration-${router.asPath}-window-scroll-${useWindowScroll}`;

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
      overscan: overscan ?? 2,
      initialOffset: (() => {
        if (!preserveScrollPosition) return;
        const pos = sessionStorage.getItem(key);
        if (pos) {
          const parsedPos = Number(pos);
          return parsedPos;
        }
        return 0;
      })(),
      initialMeasurementsCache: measurementsCache[key],
    });
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rowVirtualizer = useVirtualizer({
      count,
      estimateSize: () => estimatedItemSize ?? 0,
      getScrollElement: () => parentRef.current,
      scrollMargin: parentOffsetRef.current,
      overscan: overscan ?? 4,
      initialOffset: (() => {
        if (!preserveScrollPosition) return;
        const pos = sessionStorage.getItem(key);
        if (pos) {
          const parsedPos = Number(pos);
          return parsedPos;
        }
        return 0;
      })(),
      initialMeasurementsCache: measurementsCache[key],
    });
  }

  const renderedItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = renderedItems[renderedItems.length - 1];
    if (!lastItem) {
      return;
    }

    if (data && lastItem.index >= data.length - 1) {
      onEndReached?.();
    }
  }, [data, onEndReached, renderedItems]);

  const saveScrollPosition = useStableCallback(() => {
    sessionStorage.setItem(key, rowVirtualizer.scrollOffset.toString());
    measurementsCache[key] = rowVirtualizer.measurementsCache;
  });

  useEffect(() => {
    if (!preserveScrollPosition) return;

    const debouncedCallback = debounce(saveScrollPosition, 100);
    rowVirtualizer.scrollElement?.addEventListener("scroll", debouncedCallback);

    return () => {
      if (!preserveScrollPosition) return;

      rowVirtualizer.scrollElement?.removeEventListener(
        "scroll",
        debouncedCallback
      );
    };
  }, [
    rowVirtualizer.scrollElement,
    saveScrollPosition,
    preserveScrollPosition,
  ]);

  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          ref={parentRef}
          style={
            !useWindowScroll
              ? {
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  contain: "strict",
                  flexGrow: 1,
                  //@ts-ignore
                  ...style,
                }
              : {}
          }
        >
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
              {renderedItems.length === 0 && EmptyComponent}
              {renderedItems.map((virtualItem) => {
                const isHeader = virtualItem.index === 0 && HeaderComponent;
                const isFooter =
                  virtualItem.index === count - 1 && FooterComponent;
                const isEmpty = data?.length === 0 && EmptyComponent;

                let actualItemIndex = virtualItem.index;
                if (HeaderComponent && actualItemIndex > 0) {
                  actualItemIndex -= 1;
                }

                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={rowVirtualizer.measureElement}
                    style={{ width: "100%" }}
                  >
                    {isHeader && HeaderComponent}

                    {isFooter && FooterComponent}

                    {isEmpty && EmptyComponent}

                    {typeof data?.[actualItemIndex] !== "undefined" &&
                    !isFooter &&
                    !isHeader &&
                    !isEmpty ? (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {data
                          .slice(
                            actualItemIndex * numColumns,
                            actualItemIndex * numColumns + numColumns
                          )
                          .map((item, i) => {
                            const realIndex = actualItemIndex * numColumns + i;
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
        </div>
      </div>
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

const InfiniteScrollList = InfiniteScrollListImpl;

export { InfiniteScrollList };

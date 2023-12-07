import {
  useEffect,
  useRef,
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  isValidElement,
  forwardRef,
  Fragment,
  memo,
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
export const CellContainer = Fragment;
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
    containerTw?: string;
  },
  ref: any
) {
  const {
    data,
    renderItem,
    extraData,
    onViewableItemsChanged,
    pagingEnabled,
    viewabilityConfig,
    ItemSeparatorComponent,
    estimatedItemSize,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    onEndReached,
    initialScrollIndex,
    numColumns = 1,
    overscan,
    style,
    useWindowScroll = true,
    inverted,
    preserveScrollPosition = false,
    containerTw = "",
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

  const viewableItems = useRef<ViewToken[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollMarginOffseRef = useRef<HTMLDivElement>(null);
  const positionWasRestored = useRef<boolean>(false);

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
        if (initialScrollIndex && estimatedItemSize) {
          return initialScrollIndex * estimatedItemSize;
        }
        if (!preserveScrollPosition || positionWasRestored.current) return;
        const pos = sessionStorage.getItem(key);
        if (pos) {
          const parsedPos = Number(pos);
          positionWasRestored.current = true;
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
        if (initialScrollIndex && estimatedItemSize) {
          return initialScrollIndex * estimatedItemSize;
        }
        if (!preserveScrollPosition || positionWasRestored.current) return;
        const pos = sessionStorage.getItem(key);
        if (pos) {
          const parsedPos = Number(pos);
          positionWasRestored.current = true;
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

    if (count > 0 && lastItem.index >= count - 1) {
      onEndReached?.();
    }
  }, [count, onEndReached, renderedItems]);

  const saveScrollPosition = useStableCallback(() => {
    sessionStorage.setItem(key, rowVirtualizer.scrollOffset.toString());
    measurementsCache[key] = rowVirtualizer.measurementsCache;
  });

  const saveWhenIdle = useStableCallback(() => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(saveScrollPosition);
    } else {
      saveScrollPosition();
    }
  });

  useEffect(() => {
    if (!preserveScrollPosition) return;

    const debouncedCallback = debounce(saveWhenIdle, 100);
    rowVirtualizer.scrollElement?.addEventListener("scroll", debouncedCallback);

    return () => {
      if (!preserveScrollPosition) return;

      rowVirtualizer.scrollElement?.removeEventListener(
        "scroll",
        debouncedCallback
      );
    };
  }, [rowVirtualizer.scrollElement, preserveScrollPosition, saveWhenIdle]);

  const transformStyle = inverted ? { transform: "scaleY(-1)" } : {};

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLElement;

      if (currentTarget) {
        currentTarget.scrollTop -= e.deltaY;
      }
    };
    if (inverted) {
      parentRef.current?.addEventListener("wheel", handleScroll, {
        passive: false,
      });
    }

    return () => {
      if (inverted) {
        parentRef.current?.removeEventListener("wheel", handleScroll);
      }
    };
  }, [inverted]);

  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ...transformStyle,
        }}
      >
        <div
          ref={(v) => {
            // @ts-ignore
            parentRef.current = v;
            if (ref) {
              ref.current = v;
            }
          }}
          className={containerTw}
          style={
            !useWindowScroll
              ? {
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarGutter: "stable",
                  scrollbarWidth: "thin",
                  contain: "strict",
                  flexGrow: 1,
                  //@ts-ignore
                  ...style,
                  "scroll-snap-type": pagingEnabled ? "y mandatory" : undefined,
                }
              : {}
          }
        >
          <div style={transformStyle}>{HeaderComponent}</div>
          <div
            ref={scrollMarginOffseRef}
            style={{
              height:
                rowVirtualizer.getTotalSize() === 0
                  ? "100%"
                  : rowVirtualizer.getTotalSize() -
                    (useWindowScroll ? 0 : parentOffsetRef.current),
              width: "100%",
              position: "relative",
              flex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                minHeight:
                  rowVirtualizer.getTotalSize() === 0 ? "100%" : undefined,
                transform: `translateY(${
                  renderedItems[0]?.start - rowVirtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {data?.length === 0 && EmptyComponent ? (
                <div
                  style={{
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                    ...transformStyle,
                  }}
                >
                  {EmptyComponent}
                </div>
              ) : null}
              {renderedItems.map((virtualItem) => {
                const index = virtualItem.index;
                const chuckItem = data?.slice(
                  index * numColumns,
                  index * numColumns + numColumns
                );
                return (
                  <div
                    key={virtualItem.key}
                    data-index={index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      width: "100%",
                      ...transformStyle,
                      // @ts-ignore
                      "scroll-snap-align": pagingEnabled ? "start" : undefined,
                      "scroll-snap-stop": pagingEnabled ? "always" : undefined,
                    }}
                  >
                    {typeof data?.[index] !== "undefined" ? (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {chuckItem?.map((item, i) => {
                          const realIndex = index * numColumns + i;

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
                        {chuckItem &&
                          chuckItem?.length < numColumns &&
                          new Array(numColumns - chuckItem?.length)
                            .fill(0)
                            .map((_, itemIndex) => (
                              <div
                                key={`${
                                  index * numColumns +
                                  itemIndex +
                                  (numColumns - chuckItem?.length)
                                }`}
                                style={{
                                  width: "100%",
                                }}
                              />
                            ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {!useWindowScroll && FooterComponent ? (
                <div style={transformStyle}>{FooterComponent}</div>
              ) : null}
            </div>
          </div>

          {useWindowScroll && FooterComponent}
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
  ...rest
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
    <div style={{ width: "100%" }} ref={ref} {...rest}>
      {children}
    </div>
  );
};

const InfiniteScrollList = memo(forwardRef(InfiniteScrollListImpl));

export { InfiniteScrollList };

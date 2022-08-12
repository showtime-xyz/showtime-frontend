import { forwardRef, useCallback } from "react";

import { useSharedValue } from "react-native-reanimated";

import {
  InfiniteScrollList,
  InfiniteScrollListProps,
} from "app/lib/infinite-scroll-list";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "./viewability-tracker-flatlist";

type ViewabilityItemsContextType = any[];

const viewabilityConfig = {
  minimumViewTime: 50,
  itemVisiblePercentThreshold: 50,
};

export const ViewabilityTrackerInfiniteScrollList = forwardRef(
  (props: InfiniteScrollListProps<any>, ref: any) => {
    const visibleItems = useSharedValue<ViewabilityItemsContextType>([]);

    const { keyExtractor, renderItem: _renderItem } = props;

    const onViewableItemsChanged = useCallback(
      ({ viewableItems }: any) => {
        const viewableItem = viewableItems[0];
        if (props.data && viewableItem) {
          const visibleIndex = Number(viewableItem.key);
          const prevIndex = visibleIndex > 0 ? visibleIndex - 1 : undefined;
          const nextIndex =
            visibleIndex < props.data.length ? visibleIndex + 1 : undefined;

          const newWindow = [prevIndex, visibleIndex, nextIndex];
          visibleItems.value = newWindow;
        }
      },
      [props.data, visibleItems]
    );

    const renderItem = useCallback(
      (params: any) => {
        return (
          <ItemKeyContext.Provider
            value={
              keyExtractor
                ? keyExtractor(params.item, params.index)
                : params.index
            }
          >
            {_renderItem?.(params)}
          </ItemKeyContext.Provider>
        );
      },

      [_renderItem, keyExtractor]
    );

    return (
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <InfiniteScrollList
          {...props}
          ref={ref}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={renderItem}
        />
      </ViewabilityItemsContext.Provider>
    );
  }
);
ViewabilityTrackerInfiniteScrollList.displayName =
  "ViewabilityTrackerInfiniteScrollList";

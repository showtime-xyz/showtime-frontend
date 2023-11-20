import * as React from "react";
import { createContext, forwardRef, useCallback, useMemo } from "react";

import { useSharedValue, SharedValue } from "react-native-reanimated";

type ViewabilityItemsContextType = any[];

export const ViewabilityItemsContext = createContext<
  SharedValue<ViewabilityItemsContextType>
>({
  value: [],
  addListener: function (
    listenerID: number,
    listener: (value: any) => void
  ): void {},
  removeListener: function (listenerID: number): void {},
  modify: function (modifier: (value: any) => any): void {},
});

export const ItemKeyContext = createContext<any | undefined>(undefined);

const viewabilityConfig = {
  minimumViewTime: 50,
  itemVisiblePercentThreshold: 70,
};

export function withViewabilityInfiniteScrollList<T>(Component: T): T {
  const ViewabilityInfiniteScrollList = forwardRef(
    function ViewabilityInfiniteScrollList(props: any, ref: any) {
      const visibleItems = useSharedValue<ViewabilityItemsContextType>([]);

      const { renderItem: _renderItem } = props;

      const onViewableItemsChanged = useCallback(
        ({ viewableItems }: any) => {
          let viewableItem = viewableItems[0];
          if (viewableItems.length > 4) {
            viewableItem = viewableItems[Math.floor(viewableItems.length) / 2];
          }

          if (props.data && viewableItem) {
            const visibleIndex = Number(viewableItem.index);

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
            <ItemKeyContext.Provider value={params.index}>
              {_renderItem?.(params)}
            </ItemKeyContext.Provider>
          );
        },

        [_renderItem]
      );

      return (
        <ViewabilityItemsContext.Provider value={visibleItems}>
          {/* @ts-ignore */}
          <Component
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

  return ViewabilityInfiniteScrollList as unknown as T;
}

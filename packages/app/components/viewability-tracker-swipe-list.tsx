import { forwardRef, useCallback } from "react";
import { Platform } from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { RecyclerListView } from "app/lib/recyclerlistview";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "./viewability-tracker-flatlist";

type ViewabilityItemsContextType = number[];

export const ViewabilityTrackerRecyclerList = forwardRef(
  (props: React.ComponentProps<typeof RecyclerListView>, ref: any) => {
    const visibleItems = useSharedValue<ViewabilityItemsContextType>([]);

    const { rowRenderer: _rowRenderer } = props;

    const rowRenderer = useCallback(
      (type: any, item: any, index: number) => (
        <ItemKeyContext.Provider value={index}>
          {_rowRenderer?.(type, item, index)}
        </ItemKeyContext.Provider>
      ),
      [_rowRenderer]
    );

    const onVisibleIndicesChanged = useCallback(
      (indices: number[]) => {
        // android sends 2 indices. Will work on adding viewability config in recyclyerlist
        // TODO: https://github.com/Flipkart/recyclerlistview/issues/551
        const visibleIndex = indices[0];
        if (visibleIndex !== visibleItems.value[1]) {
          if (Platform.OS === "ios") {
            if (indices.length === 1) {
              const prevIndex = props.dataProvider.getDataForIndex(
                visibleIndex - 1
              )
                ? visibleIndex - 1
                : undefined;
              const nextIndex = props.dataProvider.getDataForIndex(
                visibleIndex + 1
              )
                ? visibleIndex + 1
                : undefined;

              const newWindow = [prevIndex, visibleIndex, nextIndex];
              visibleItems.value = newWindow;
            }
          } else {
            visibleItems.value = [undefined, visibleIndex, undefined];
          }
        }
      },
      [props.dataProvider, visibleItems]
    );

    return (
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <RecyclerListView
          {...props}
          rowRenderer={rowRenderer}
          ref={ref}
          onVisibleIndicesChanged={onVisibleIndicesChanged}
          useWindowScroll={Platform.OS === "web"}
        />
      </ViewabilityItemsContext.Provider>
    );
  }
);

ViewabilityTrackerRecyclerList.displayName = "ViewabilityTrackerRecyclerList";

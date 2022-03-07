import { forwardRef, useCallback } from "react";

import { useSharedValue } from "react-native-reanimated";
import { RecyclerListView } from "recyclerlistview";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "./viewability-tracker-flatlist";

type ViewabilityItemsContextType = number[];
const MAX_VISIBLE_ITEM = 1;

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

    const onVisibleIndicesChanged = useCallback((indices: number[]) => {
      visibleItems.value = indices.slice(0, MAX_VISIBLE_ITEM);
    }, []);

    return (
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <RecyclerListView
          {...props}
          rowRenderer={rowRenderer}
          ref={ref}
          onVisibleIndicesChanged={onVisibleIndicesChanged}
        />
      </ViewabilityItemsContext.Provider>
    );
  }
);

import { createContext, forwardRef, useCallback, useMemo } from "react";
import { FlatList, FlatListProps } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

const MAX_VIEWABLE_ITEMS = 4;

export const ViewabilityItemsContext = createContext<
  Animated.SharedValue<any[]>
>({
  value: [],
});

export const ViewabilityTrackerFlatlist = forwardRef(
  (props: FlatListProps<any>, ref: any) => {
    const visibleItems = useSharedValue<any[]>([]);

    const { keyExtractor, renderItem: _renderItem } = props;

    const renderItem = useCallback(
      (params: any) => (
        <ItemKeyContext.Provider
          value={keyExtractor?.(params.item, params.index)}
        >
          {_renderItem?.(params)}
        </ItemKeyContext.Provider>
      ),
      [_renderItem, keyExtractor]
    );

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
      // TODO: change this to object for faster lookups, has at max 4 values so this doesn't look that bad
      visibleItems.value = viewableItems
        .slice(0, MAX_VIEWABLE_ITEMS)
        .map((v: any) => v.key);
    }, []);

    return (
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <FlatList
          {...props}
          onViewableItemsChanged={onViewableItemsChanged}
          ref={ref}
          viewabilityConfig={useMemo(
            () => ({ itemVisiblePercentThreshold: 70 }),
            []
          )}
          renderItem={renderItem}
        />
      </ViewabilityItemsContext.Provider>
    );
  }
);

export const ItemKeyContext = createContext<string | undefined>(undefined);

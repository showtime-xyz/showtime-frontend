import { createContext, forwardRef, useCallback } from "react";
import { FlatList, FlatListProps, ViewToken } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

const MAX_VIEWABLE_ITEMS = 4;

type ViewabilityItemsContextType = string[];

export const ViewabilityItemsContext = createContext<
  Animated.SharedValue<ViewabilityItemsContextType>
>({
  value: [],
});

export const ViewabilityTrackerFlatlist = forwardRef(
  (props: FlatListProps<any>, ref: any) => {
    const visibleItems = useSharedValue<ViewabilityItemsContextType>([]);

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
      visibleItems.value = viewableItems
        .slice(0, MAX_VIEWABLE_ITEMS)
        .map((item: any) => item.key);
    }, []);

    return (
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <FlatList
          {...props}
          onViewableItemsChanged={onViewableItemsChanged}
          ref={ref}
          renderItem={renderItem}
        />
      </ViewabilityItemsContext.Provider>
    );
  }
);

export const ItemKeyContext = createContext<string | undefined>(undefined);

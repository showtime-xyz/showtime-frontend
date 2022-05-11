import { createContext, forwardRef, useCallback, useMemo } from "react";
import { FlatList, FlatListProps } from "react-native";

import Animated, { useSharedValue } from "react-native-reanimated";

import { VideoConfigContext } from "app/context/video-config-context";

type ViewabilityItemsContextType = any[];

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

    const videoConfig = useMemo(
      () => ({
        isMuted: true,
        useNativeControls: false,
        previewOnly: true,
      }),
      []
    );

    return (
      <VideoConfigContext.Provider value={videoConfig}>
        <ViewabilityItemsContext.Provider value={visibleItems}>
          <FlatList {...props} ref={ref} renderItem={renderItem} />
        </ViewabilityItemsContext.Provider>
      </VideoConfigContext.Provider>
    );
  }
);
ViewabilityTrackerFlatlist.displayName = "ViewabilityTrackerFlatlist";

export const ItemKeyContext = createContext<any | undefined>(undefined);

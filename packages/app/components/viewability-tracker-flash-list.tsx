import { createContext, forwardRef, useCallback, useMemo } from "react";

import { FlashList, FlashListProps } from "@shopify/flash-list";
import Animated, { useSharedValue } from "react-native-reanimated";

import { VideoConfigContext } from "app/context/video-config-context";

type ViewabilityItemsContextType = any[];

const viewabilityConfig = {
  minimumViewTime: 100,
  itemVisiblePercentThreshold: 50,
};

export const ViewabilityItemsContext = createContext<
  Animated.SharedValue<ViewabilityItemsContextType>
>({
  value: [],
});

export const ViewabilityTrackerFlashList = forwardRef(
  (props: FlashListProps<any>, ref: any) => {
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
          <FlashList
            {...props}
            ref={ref}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            renderItem={renderItem}
          />
        </ViewabilityItemsContext.Provider>
      </VideoConfigContext.Provider>
    );
  }
);
ViewabilityTrackerFlashList.displayName = "ViewabilityTrackerFlashList";

export const ItemKeyContext = createContext<any | undefined>(undefined);

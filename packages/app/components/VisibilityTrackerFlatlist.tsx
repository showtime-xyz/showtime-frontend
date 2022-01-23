import {
  createContext,
  forwardRef,
  RefObject,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useIsFocused } from "@react-navigation/native";
import { FlatList, FlatListProps, ViewToken } from "react-native";
import { Video as ExpoVideo } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";

type VisibileItemsContextType = {
  [key: string]: boolean;
};

const VisibilityItemsContext = createContext<
  Animated.SharedValue<VisibileItemsContextType>
>({
  value: {},
});

export const VisibilityTrackerFlatlist = forwardRef(
  (props: FlatListProps<any>, ref: any) => {
    const visibleItems = useSharedValue<VisibileItemsContextType>({});

    const { keyExtractor, renderItem: _renderItem } = props;

    const renderItem = useCallback(
      (params: any) => (
        <ItemKeyContext.Provider
          value={keyExtractor?.(params.item, params.index)}
        >
          {_renderItem?.(params)}
        </ItemKeyContext.Provider>
      ),
      [_renderItem]
    );

    const onViewableItemsChanged = useCallback(
      ({ changed, viewableItems }: any) => {
        let finalItems = viewableItems.value;
        viewableItems.forEach((v: ViewToken) => {
          finalItems = {
            ...finalItems,
            [v.key]: v.isViewable,
          };
        });

        changed.forEach((v: ViewToken) => {
          finalItems = {
            ...finalItems,
            [v.key]: v.isViewable,
          };
        });

        visibleItems.value = finalItems;
      },
      []
    );

    return (
      <VisibilityItemsContext.Provider value={visibleItems}>
        <FlatList
          {...props}
          onViewableItemsChanged={onViewableItemsChanged}
          ref={ref}
          renderItem={renderItem}
        />
      </VisibilityItemsContext.Provider>
    );
  }
);

export const ItemKeyContext = createContext<string | undefined>(undefined);

export const usePlayVideoOnVisible = (
  videoRef: RefObject<ExpoVideo> | null
) => {
  const id = useContext(ItemKeyContext);
  const context = useContext(VisibilityItemsContext);
  const isFocused = useIsFocused();

  const playVideo = () => {
    videoRef?.current?.playAsync();
  };

  const pauseVideo = () => {
    videoRef?.current?.pauseAsync();
  };

  useEffect(() => {
    videoRef?.current?.setOnPlaybackStatusUpdate((status) => {
      if (isFocused) {
        //@ts-ignore
        if (status.didJustFinish) {
          videoRef.current?.replayAsync();
        }
        // if screen removed from focus but video is playing, pause it
        //@ts-ignore
      } else if (status.isPlaying) {
        videoRef.current?.pauseAsync();
      }
    });
  }, [isFocused]);

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (id && isFocused) {
        if (ctx[id]) {
          runOnJS(playVideo)();
        } else {
          runOnJS(pauseVideo)();
        }
      }
    },
    [isFocused]
  );
};

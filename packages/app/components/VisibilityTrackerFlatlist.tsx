import {
  createContext,
  forwardRef,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIsFocused } from "@react-navigation/native";
import { FlatList, FlatListProps, ViewToken } from "react-native";
import { Video as ExpoVideo } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { useIsTabFocused } from "design-system/tabs/tablib";

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
      [_renderItem, keyExtractor]
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

let VideoInstanceManager = (maxInstances: number) => {
  let instances: string[] = [];
  let subscribers: Array<{
    id: string;
    callback: (mount: boolean) => void;
  }> = [];

  const subscribe = (id: any, callback: (mount: boolean) => void) => {
    subscribers.push({ id, callback });
    return {
      remove: () => {
        subscribers = subscribers.filter((s: any) => s.id !== id);
      },
    };
  };

  const onAddInstance = (id: any) => {
    if (instances.includes(id)) {
      subscribers.forEach((s: any) => {
        if (s.id === id) s.callback(true);
      });
      return;
    }

    if (instances.length > maxInstances) {
      onRemoveInstance(instances[0]);
    }
    instances.push(id);
    subscribers.forEach((s: any) => {
      if (s.id === id) s.callback(true);
    });
  };

  const onRemoveInstance = (id: any) => {
    instances = instances.filter((i) => i !== id);
    subscribers.forEach((s: any) => {
      if (s.id === id) s.callback(false);
    });
  };

  return {
    subscribe,
    instances,
    onAddInstance,
    onRemoveInstance,
  };
};

const videoInstance = VideoInstanceManager(3);

export const usePlayVideoOnVisible = (
  videoRef: RefObject<ExpoVideo> | null,
  source: any
) => {
  const id = useContext(ItemKeyContext);
  // const context = useContext(VisibilityItemsContext);
  // const isItemInList = typeof id !== "undefined";

  const [mounted, setMounted] = useState(false);
  // const loading = useRef(false);
  // let isListFocused = useIsTabFocused();

  // const playVideo = () => {
  //   if (!mounted) {
  //     videoInstance.onAddInstance(id);
  //   }
  // };

  // const pauseVideo = () => {
  //   if (mounted) {
  //     videoInstance.onRemoveInstance(id);
  //   }
  // };

  // useEffect(() => {
  //   const listener = videoInstance.subscribe(id, (mount) => {
  //     setMounted(mount);
  //   });

  //   return () => {
  //     listener.remove();
  //   };
  // }, [id]);

  // useEffect(() => {
  //   if (!isListFocused) {
  //     videoRef?.current?.unloadAsync();
  //     videoInstance.onRemoveInstance(id);
  //   } else if (id && context.value[id]) {
  //     videoInstance.onAddInstance(id);
  //   }
  // }, [isListFocused, id]);

  // useEffect(() => {
  //   async function loadVideo() {
  //     if (mounted && !loading.current) {
  //       try {
  //         loading.current = true;
  //         await videoRef?.current?.loadAsync(source, {
  //           shouldPlay: true,
  //           isLooping: true,
  //           isMuted: true,
  //         });
  //       } catch (e) {
  //       } finally {
  //         loading.current = false;
  //       }
  //     }
  //   }
  //   loadVideo();
  //   return () => {
  //     // if (played.current) {
  //     //   videoRef?.current?.unloadAsync();
  //     //   played.current = false;
  //     // }
  //   };
  // }, [mounted, source]);

  // useAnimatedReaction(
  //   () => context.value,
  //   (ctx) => {
  //     if (isItemInList && ctx[id] === true) {
  //       runOnJS(playVideo)();
  //     } else if (isItemInList && ctx[id] === false) {
  //       runOnJS(pauseVideo)();
  //     }
  //   },
  //   []
  // );

  return {
    mounted,
    id,
  };
};

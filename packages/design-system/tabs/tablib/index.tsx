import React, { useContext, ForwardedRef, useMemo, useRef } from "react";
import { tw } from "../../tailwind";
import {
  Pressable,
  View,
  Animated,
  useWindowDimensions,
  StyleSheet,
  ScrollViewProps,
  ViewProps,
  PressableProps,
  FlatList,
  Platform,
  Dimensions,
  FlatListProps,
} from "react-native";
import PagerView from "react-native-pager-view";
import Reanimated, {
  useSharedValue,
  useDerivedValue,
  scrollTo,
  useAnimatedRef,
  runOnJS,
  runOnUI,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedReaction,
} from "react-native-reanimated";
import { TabListProps, TabRootProps, TabsContextType } from "./types";
import { useScrollToTop } from "@react-navigation/native";

const windowHeight = Dimensions.get("window").height;

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export const TabsContext = React.createContext(null as TabsContextType);

const Root = ({
  children,
  tabListHeight: initialtabListHeight,
  initialIndex = 0,
  onIndexChange: onIndexChangeProp,
  lazy,
}: TabRootProps) => {
  const pagerRef = React.useRef();
  const index = useSharedValue(initialIndex ?? 0);
  const position = React.useRef(new Animated.Value(0)).current;
  const offset = React.useRef(new Animated.Value(0)).current;
  const translateY = useSharedValue(0);
  // maybe change this to shared value too
  const [headerHeight, setHeaderHeight] = React.useState(0);
  // maybe change this to shared value too
  const [tabListHeight, setTabListHeight] =
    React.useState(initialtabListHeight);
  const requestOtherViewsToSyncTheirScrollPosition = useSharedValue(false);
  const tablistScrollRef = useAnimatedRef<Reanimated.ScrollView>();
  const tabItemLayouts = [];

  const onIndexChange = (newIndex) => {
    index.value = newIndex;
    onIndexChangeProp(newIndex);
  };

  // We need to put both header and TabBar in absolute view so filter here, bad for composition, maybe improve later
  const { tabListChild, restChildren, headerChild } = React.useMemo(() => {
    let tabListChild;
    let restChildren = [];
    let headerChild;
    React.Children.forEach(children, (c) => {
      if (React.isValidElement(c) && c) {
        //@ts-ignore
        if (c.type === List) {
          tabListChild = c;
          //@ts-ignore
        } else if (c.type === Header) {
          headerChild = c;
        } else {
          restChildren.push(c);
        }
      }
    });
    return { tabListChild, headerChild, restChildren };
  }, [children]);

  const headerTranslateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useAnimatedReaction(
    () => {
      return index.value;
    },
    (v, newV) => {
      if (v !== newV) {
        requestOtherViewsToSyncTheirScrollPosition.value = false;
      }
    }
  );

  return (
    <TabsContext.Provider
      value={{
        tabListHeight,
        index,
        tabItemLayouts,
        tablistScrollRef,
        requestOtherViewsToSyncTheirScrollPosition,
        translateY,
        offset,
        position,
        headerHeight,
        initialIndex,
        onIndexChange,
        pagerRef,
        lazy,
      }}
    >
      <Reanimated.View
        style={[utilStyles.a, headerTranslateStyle]}
        pointerEvents="box-none"
      >
        <View
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
          pointerEvents="box-none"
        >
          {headerChild}
        </View>
        <View
          style={{ flex: 1 }}
          onLayout={(e) => setTabListHeight(e.nativeEvent.layout.height)}
          pointerEvents="box-none"
        >
          {tabListChild}
        </View>
      </Reanimated.View>
      {/* mount children only when tabBar and header heights are known */}
      {(headerHeight || !headerChild) && tabListHeight ? restChildren : null}
    </TabsContext.Provider>
  );
};

const List = ({
  children,
  style,
  contentContainerStyle,
  ...props
}: TabListProps) => {
  const { tablistScrollRef, index, tabItemLayouts } = useContext(TabsContext);

  const newChildren = React.useMemo(() => {
    let triggerIndex = -1;

    return React.Children.map(children, (c) => {
      // @ts-ignore - Todo - do better ts check here
      if (React.isValidElement(c) && c && c.type === Trigger) {
        triggerIndex++;
        // @ts-ignore - Todo - do better ts check here
        return React.cloneElement(c, { index: triggerIndex });
      } else {
        return c;
      }
    });
  }, [children]);

  const listWidth = useSharedValue(0);
  const windowWidth = useWindowDimensions().width;
  const prevIndex = useSharedValue(0);

  const scrollTo = (x) => {
    // @ts-ignore getNode will be removed in future, need to update typings
    tablistScrollRef.current.scrollTo({ x });
  };

  useDerivedValue(() => {
    if (prevIndex.value) {
      if (tabItemLayouts[index.value].value) {
        const itemLayoutX = tabItemLayouts[index.value].value.x;
        const itemWidth = tabItemLayouts[index.value].value.width;
        runOnJS(scrollTo)(itemLayoutX - windowWidth / 2 + itemWidth / 2);
      }
    }
    prevIndex.value = index.value;
  }, [windowWidth]);

  const styles = React.useMemo(() => {
    return [tw.style(`bg-white dark:bg-gray-900`), style];
  }, [style]);

  return (
    <Reanimated.ScrollView
      onLayout={(e) => {
        listWidth.value = e.nativeEvent.layout.width;
      }}
      bounces={false}
      ref={tablistScrollRef}
      showsHorizontalScrollIndicator={false}
      horizontal
      style={styles}
      contentContainerStyle={useMemo(
        () =>
          StyleSheet.flatten([
            {
              paddingHorizontal: 16,
            },
            contentContainerStyle,
          ]),
        [contentContainerStyle]
      )}
      {...props}
    >
      {newChildren}
    </Reanimated.ScrollView>
  );
};

const TabIndexContext = React.createContext({} as { index: number });

const Pager = ({ children }) => {
  const {
    initialIndex,
    onIndexChange,
    pagerRef,
    position,
    offset,
    translateY,
    lazy,
    index,
  } = useContext(TabsContext);

  const [mountedIndices, setMountedIndices] = React.useState(
    lazy ? [initialIndex] : React.Children.map(children, (_c, i) => i)
  );

  const newChildren = React.useMemo(
    () =>
      React.Children.map(children, (c, i) => {
        const shouldLoad = mountedIndices.includes(i);
        return (
          // why use context if we can clone the children. do we need better composition here?
          <TabIndexContext.Provider value={{ index: i }} key={c.key ?? i}>
            {
              <View
                style={[
                  utilStyles.b,
                  shouldLoad ? StyleSheet.absoluteFill : undefined,
                ]}
              >
                {shouldLoad ? c : null}
              </View>
            }
          </TabIndexContext.Provider>
        );
      }),
    [children, mountedIndices]
  );

  useAnimatedReaction(
    () => {
      return index.value;
    },
    (res, prev) => {
      if (res !== prev && !mountedIndices.includes(res)) {
        runOnJS(setMountedIndices)(mountedIndices.concat(res));
      }
    },
    [mountedIndices]
  );

  return (
    <AnimatedPagerView
      style={{ flex: 1 }}
      ref={pagerRef}
      // Todo - make this work with reanimated event handlers
      onPageScroll={Animated.event(
        [
          {
            nativeEvent: {
              position: position,
              offset: offset,
            },
          },
        ],
        { useNativeDriver: true }
      )}
      initialPage={initialIndex}
      onPageSelected={(e) => onIndexChange(e.nativeEvent.position)}
    >
      {newChildren}
    </AnimatedPagerView>
  );
};

const Content = React.forwardRef(
  ({ style, ...props }: ViewProps, ref: ForwardedRef<View>) => {
    const { headerHeight, tabListHeight } = useContext(TabsContext);
    return (
      <View
        {...props}
        ref={ref}
        style={[style, { paddingTop: headerHeight + tabListHeight }]}
      />
    );
  }
);

const Trigger = React.forwardRef(
  (
    {
      children,
      //@ts-ignore - index will be passed by Pager via context
      index,
      onLayout,
      onPress,
      ...props
    }: PressableProps,
    ref: ForwardedRef<typeof Pressable>
  ) => {
    const { pagerRef, tabItemLayouts } = useContext(TabsContext);

    if (typeof index !== "number" && __DEV__) {
      console.error("Make sure you wrap Tabs.Trigger inside Tabs.Pager");
    }

    tabItemLayouts[index] = useSharedValue(null);

    return (
      <Pressable
        onLayout={(e) => {
          tabItemLayouts[index].value = e.nativeEvent.layout;
          onLayout?.(e);
        }}
        onPress={(e) => {
          pagerRef.current.setPage(index);
          onPress?.(e);
        }}
        {...props}
      >
        <TabIndexContext.Provider value={{ index }}>
          {children}
        </TabIndexContext.Provider>
      </Pressable>
    );
  }
);

function makeScrollableComponent<K extends object, T extends any>(Comp: T) {
  return React.forwardRef((props: K, ref: ForwardedRef<T>) => {
    const {
      headerHeight,
      requestOtherViewsToSyncTheirScrollPosition,
      tabListHeight,
      translateY,
      index,
    } = useContext(TabsContext);
    const elementIndex = React.useContext(TabIndexContext).index;
    const aref = useAnimatedRef<Reanimated.ScrollView>();
    const scrollY = useSharedValue(0);
    const topHeight = headerHeight + tabListHeight;
    const translateYOffset = Platform.OS === "ios" ? topHeight : 0;

    const scrollHandler = useAnimatedScrollHandler({
      onBeginDrag() {
        requestOtherViewsToSyncTheirScrollPosition.value = false;
      },
      onMomentumBegin() {
        requestOtherViewsToSyncTheirScrollPosition.value = false;
      },
      onScroll(e) {
        // Todo - this is a hack to make sure we change header when listening current flatlist scrolls. Other flatlist scroll events may be triggered as we try to adjust their scroll positions to accomodate header
        if (index.value === elementIndex) {
          scrollY.value = e.contentOffset.y;
          if (Platform.OS === "ios") {
            translateY.value = interpolate(
              scrollY.value,
              [-translateYOffset, -tabListHeight],
              [0, -headerHeight],
              Extrapolate.CLAMP
            );
          } else {
            translateY.value = interpolate(
              scrollY.value,
              [0, headerHeight],
              [0, -headerHeight],
              Extrapolate.CLAMP
            );
          }
        }
      },
      onEndDrag() {
        requestOtherViewsToSyncTheirScrollPosition.value = true;
      },
      onMomentumEnd() {
        requestOtherViewsToSyncTheirScrollPosition.value = true;
      },
    });

    // sync other flatlist's scroll position if header is translated
    useDerivedValue(() => {
      if (
        index.value !== elementIndex &&
        requestOtherViewsToSyncTheirScrollPosition.value
      ) {
        const absTranslateY = -1 * translateY.value;
        if (
          absTranslateY < headerHeight ||
          scrollY.value + translateYOffset < absTranslateY
        ) {
          scrollTo(aref, 0, absTranslateY - translateYOffset, false);
        }
      }
    }, [translateYOffset]);

    const _ref = useRef<FlatList>(null);

    useScrollToTop(
      React.useRef({
        scrollToTop: () => {
          runOnUI(scrollTo)(aref, 0, -translateYOffset, true);
        },
      })
    );

    return (
      // @ts-ignore
      <Comp
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        alwaysBounceHorizontal={false}
        automaticallyAdjustContentInsets={false}
        ref={mergeRef([ref, aref, _ref])}
        contentOffset={useMemo(
          () => ({
            y:
              Platform.OS === "ios"
                ? -topHeight + -1 * translateY.value
                : -1 * translateY.value,
          }),
          [topHeight]
        )}
        contentInset={useMemo(
          () => ({
            top: Platform.OS === "ios" ? topHeight : 0,
          }),
          [topHeight]
        )}
        contentContainerStyle={useMemo(
          () => ({
            paddingTop: Platform.OS === "android" ? topHeight : 0,
            minHeight: windowHeight,
          }),
          [topHeight]
        )}
        progressViewOffset={topHeight}
        {...props}
      />
    );
  });
}

const TabScrollView = makeScrollableComponent<
  ScrollViewProps,
  typeof Reanimated.ScrollView
>(Reanimated.ScrollView);
const AnimatedFlatList = Reanimated.createAnimatedComponent(FlatList);
const TabFlatList = makeScrollableComponent<
  FlatListProps<any>,
  typeof AnimatedFlatList
>(AnimatedFlatList);

const Header = (props) => {
  return props.children;
};

export const Tabs = {
  Root,
  List,
  Pager,
  Trigger,
  View: Content,
  Header,
  ScrollView: TabScrollView,
  FlatList: TabFlatList,
};

export const useTabsContext = () => {
  const ctx = useContext(TabsContext);

  if (ctx === null) {
    console.error("Make sure useTabsContext is rendered within Tabs.Root");
  }

  return ctx;
};

export const useTabIndexContext = () => {
  const ctx = useContext(TabIndexContext);

  if (ctx === null) {
    console.error(
      "Make sure useTabIndexContext is rendered within Tabs.Trigger"
    );
  }

  return ctx;
};

function mergeRef(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

const utilStyles = StyleSheet.create({
  a: { position: "absolute", zIndex: 1, flex: 1 },
  b: {
    flex: 1,
    overflow: "hidden",
  },
});

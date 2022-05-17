import { Suspense, useContext, useEffect } from "react";
import { Platform } from "react-native";

import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { ErrorBoundary } from "app/components/error-boundary";
import { HeaderCenter } from "app/components/header";
import { SwipeList } from "app/components/swipe-list";
import { FeedContext } from "app/context/feed-context";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { Haptics } from "app/lib/haptics";
import { PagerView } from "app/lib/pager-view";
import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";
import { useNavigation } from "app/lib/react-navigation/native";
import { useSafeAreaInsets } from "app/lib/safe-area";

import { TabItem, Tabs } from "design-system";
import { PressableScale } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export const Feed = () => {
  return (
    <View tw="flex-1" testID="homeFeed">
      <ErrorBoundary>
        <Suspense fallback={<View />}>
          <FeedList />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
};

export const FeedList = () => {
  const { isAuthenticated } = useUser();
  const navigation = useNavigation();
  const { selected, pagerRef } = useContext(FeedContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.setOptions({
        headerTitle: () => <HeaderFeed />,
      });
    } else {
      navigation.setOptions({
        headerTitle: () => <HeaderCenter />,
      });
    }
  }, [isAuthenticated, navigation]);

  if (isAuthenticated) {
    if (Platform.OS === "web") {
      return <WebFeed />;
    }

    return (
      <PagerView
        ref={pagerRef}
        style={tw.style("flex-1 w-full")}
        initialPage={1}
        onPageSelected={(e) => (selected.value = e.nativeEvent.position)}
      >
        <View key="following-feed">
          <FollowingFeed />
        </View>
        <View key="algorithmic-feed">
          <AlgorithmicFeed />
        </View>
      </PagerView>
    );
  }

  return <CuratedFeed />;
};

const HeaderFeed = () => {
  const { selected, pagerRef } = useContext(FeedContext);

  const animatedStyleFirstTab = useAnimatedStyle(() => {
    const scale = withTiming(selected.value === 0 ? 1 : 0.95);
    return {
      opacity: withTiming(selected.value === 0 ? 1 : 0.5),
      transform: [{ scaleX: scale }, { scaleY: scale }],
    };
  });

  const animatedStyleSecondTab = useAnimatedStyle(() => {
    const scale = withTiming(selected.value === 1 ? 1 : 0.95);
    return {
      opacity: withTiming(selected.value === 1 ? 1 : 0.5),
      transform: [{ scaleX: scale }, { scaleY: scale }],
    };
  });

  return (
    <View tw="flex-row items-center justify-center">
      <PressableScale
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          Haptics.impactAsync();
          selected.value = 0;
          pagerRef?.current?.setPage(0);
        }}
      >
        <Animated.View style={animatedStyleFirstTab}>
          <Text variant="text-lg" tw="font-bold text-black dark:text-white">
            Following
          </Text>
        </Animated.View>
      </PressableScale>

      <View tw="w-3" />
      <View tw="h-4 w-[1px] bg-black opacity-50 dark:bg-white" />
      <View tw="w-3" />

      <PressableScale
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          Haptics.impactAsync();
          selected.value = 1;
          pagerRef?.current?.setPage(1);
        }}
      >
        <Animated.View style={animatedStyleSecondTab}>
          <Text variant="text-lg" tw="font-bold text-black dark:text-white">
            For You
          </Text>
        </Animated.View>
      </PressableScale>
    </View>
  );
};

const FollowingFeed = () => {
  const queryState = useFeed("/following");
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <SwipeList
      {...queryState}
      bottomPadding={bottomBarHeight}
      data={queryState.data}
    />
  );
};

const AlgorithmicFeed = () => {
  const queryState = useFeed("");
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <SwipeList
      {...queryState}
      bottomPadding={bottomBarHeight}
      data={queryState.data}
    />
  );
};

const CuratedFeed = () => {
  const queryState = useFeed("/curated");
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      {...queryState}
      bottomPadding={safeAreaBottom}
      data={queryState.data}
    />
  );
};

const WebFeed = () => {
  return (
    <Tabs.Root initialIndex={1}>
      <Tabs.List
        style={tw.style(`h-[${TAB_LIST_HEIGHT}px]`)}
        contentContainerStyle={tw.style(
          "w-full justify-center bg-white dark:bg-black"
        )}
      >
        <Tabs.Trigger>
          <TabItem name="Following" />
        </Tabs.Trigger>
        <Tabs.Trigger>
          <TabItem name="For You" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Pager>
        <FollowingFeed />
        <AlgorithmicFeed />
      </Tabs.Pager>
    </Tabs.Root>
  );
};

import { Suspense, useEffect, useContext } from "react";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderCenter } from "app/components/header";
import { SwipeList } from "app/components/swipe-list";
import { FeedContext } from "app/context/feed-context";
import { useFeed } from "app/hooks/use-feed";
import { useUser } from "app/hooks/use-user";

import { Pressable } from "design-system/pressable-scale";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export const Feed = () => {
  return (
    <View tw="flex-1" testID="homeFeed">
      <Suspense fallback={<View />}>
        <FeedList />
      </Suspense>
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
    return (
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0} // TODO: check if the user is following some people, otherwise default to 1
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
    <View tw="flex-row justify-center items-center">
      <Pressable
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          selected.value = 0;
          pagerRef?.current?.setPage(0);
        }}
      >
        <Animated.View style={animatedStyleFirstTab}>
          <Text variant="text-lg" tw="font-bold text-black dark:text-white">
            Following
          </Text>
        </Animated.View>
      </Pressable>

      <View tw="w-6" />

      <Pressable
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => {
          selected.value = 1;
          pagerRef?.current?.setPage(1);
        }}
      >
        <Animated.View style={animatedStyleSecondTab}>
          <Text variant="text-lg" tw="font-bold text-black dark:text-white">
            For You
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const FollowingFeed = () => {
  const queryState = useFeed("following");
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
  const queryState = useFeed("algorithmic");
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
  const queryState = useFeed("curated");
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <SwipeList
      {...queryState}
      bottomPadding={safeAreaBottom}
      data={queryState.data}
    />
  );
};

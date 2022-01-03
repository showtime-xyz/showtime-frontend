import { View } from "../../view";
import { Text } from "../../text";
import React, { useEffect } from "react";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { MotiView, AnimatePresence } from "moti";
import { useTabIndexContext, useTabsContext } from "../tablib";
import { Platform, Animated, useColorScheme } from "react-native";
import { tw } from "design-system/tailwind";
import { ActivityIndicator } from "design-system/activity-indicator";

// todo - make tabitemwidth dynamic. Current limitation of pager of using vanilla animated prevents animating width indicators.
// todo - figure out how to make reanimated native handlers work with pager view
export const Tab_ITEM_WIDTH = 120;

type TabItemProps = {
  name: string;
  count?: number;
  selected?: boolean;
};

export const TabItem = ({ name, count }: TabItemProps) => {
  const { index } = useTabIndexContext();
  const { position, offset } = useTabsContext();
  const newPos = Animated.add(position, offset);

  const opacity = newPos.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0.7, 1, 0.7],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: Tab_ITEM_WIDTH,
        },
        { opacity },
      ]}
    >
      <Text
        variant="text-sm"
        sx={{ fontWeight: "700" }}
        tw={`text-gray-900 dark:text-white`}
      >
        {name}{" "}
      </Text>

      <Text
        variant="text-sm"
        sx={{ fontWeight: "400" }}
        tw={`text-gray-900 dark:text-white`}
      >
        {count}
      </Text>
    </Animated.View>
  );
};

type PullToRefreshProps = {
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export const PullToRefresh = ({
  onRefresh,
  isRefreshing,
}: PullToRefreshProps) => {
  if (Platform.OS === "web") {
    return null;
  }

  const { refreshGestureState } = useTabsContext();
  const [refreshState, setRefreshState] = React.useState("idle");

  useEffect(() => {
    if (isRefreshing) {
      setRefreshState("refreshing");
    } else {
      refreshGestureState.value = "idle";
    }
  }, [isRefreshing]);

  useAnimatedReaction(
    () => {
      return refreshGestureState.value;
    },
    (v) => {
      if (v === "refreshing") {
        runOnJS(onRefresh)();
      } else {
        runOnJS(setRefreshState)(v);
      }
    },
    []
  );

  return (
    <AnimatePresence>
      {refreshState !== "idle" ? (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 200, type: "timing" }}
          exit={{ opacity: 0 }}
          style={[
            {
              zIndex: 1,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              alignSelf: "center",
            },
          ]}
        >
          {refreshState === "pulling" && (
            <Text tw="dark:text-white text-gray-900 text-sm">
              Release to refresh
            </Text>
          )}
          {refreshState === "cancelling" && (
            <Text tw="dark:text-white text-gray-900 text-sm">
              Pull to refresh
            </Text>
          )}
          {refreshState === "refreshing" && <ActivityIndicator />}
        </MotiView>
      ) : null}
    </AnimatePresence>
  );
};

export const SelectedTabIndicator = () => {
  if (Platform.OS === "web") {
    return null;
  }

  // todo replace with useIsDarkMode hook
  const isDark = useColorScheme() === "dark";

  const { offset, position, tabItemLayouts } = useTabsContext();
  const newPos = Animated.add(position, offset);
  const [itemOffsets, setItemOffsets] = React.useState([0, 0]);

  useAnimatedReaction(
    () => {
      let result = [];
      let sum = 0;
      for (let i = 0; i < tabItemLayouts.length; i++) {
        if (tabItemLayouts[i].value) {
          const width = tabItemLayouts[i].value.width;
          result.push(sum);
          sum = sum + width;
        }
      }
      return result;
    },
    (values) => {
      if (values.length > 1) {
        runOnJS(setItemOffsets)(values);
      }
    },
    []
  );

  const translateX = newPos.interpolate({
    inputRange: itemOffsets.map((_v, i) => i),
    outputRange: itemOffsets,
  });

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX }],
          position: "absolute",
          width: Tab_ITEM_WIDTH,
          height: "100%",
          justifyContent: "center",
        },
      ]}
    >
      <View
        style={[
          {
            height: 2,
            position: "absolute",
            zIndex: 9999,
            width: "100%",
            // negative bottom to accomodate border bottom of 1px
            bottom: -1,
          },
          tw.style(`bg-gray-900 dark:bg-gray-100`),
        ]}
      />
      <View
        sx={{
          backgroundColor: isDark
            ? "rgba(229, 231, 235, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          padding: 16,
          borderRadius: 999,
        }}
      />
    </Animated.View>
  );
};

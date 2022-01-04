import { View } from "../../view";
import { Text } from "../../text";
import React from "react";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";
import { useTabIndexContext, useTabsContext } from "../tablib";
import { Platform, Animated, useColorScheme } from "react-native";
import { tw } from "design-system/tailwind";

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
          left: 16,
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

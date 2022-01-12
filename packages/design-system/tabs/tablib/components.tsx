import { View } from "../../view";
import { Text } from "../../text";
import React from "react";
import Animated, {
  useAnimatedReaction,
  runOnJS,
  useAnimatedStyle,
  Extrapolate,
  interpolate,
} from "react-native-reanimated";
import { useTabIndexContext, useTabsContext } from "../tablib";
import { Platform } from "react-native";
import { tw } from "design-system/tailwind";
import { useIsDarkMode } from "../../hooks";

type TabItemProps = {
  name: string;
  count?: number;
  selected?: boolean;
};

export const TabItem = ({ name, count }: TabItemProps) => {
  const { index } = useTabIndexContext();
  const { position, offset } = useTabsContext();

  const animatedStyle = useAnimatedStyle(() => {
    const newPos = position.value + offset.value;

    return {
      opacity: interpolate(
        newPos,
        [index - 1, index, index + 1],
        [0.7, 1, 0.7],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          paddingHorizontal: 16,
        },
        animatedStyle,
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
  // const isDark = useIsDarkMode();

  const { offset, position, tabItemLayouts } = useTabsContext();
  const [itemOffsets, setItemOffsets] = React.useState([0, 0]);

  useAnimatedReaction(
    () => {
      let result = [];
      let sum = 0;
      for (let i = 0; i < tabItemLayouts.length; i++) {
        if (tabItemLayouts[i].value) {
          const width = tabItemLayouts[i].value
            ? tabItemLayouts[i].value.width
            : 0;
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

  const animatedStyle = useAnimatedStyle(() => {
    const newPos = position.value + offset.value;
    const tabIndices = tabItemLayouts.map((_v, i) => i);
    const tabWidths = tabItemLayouts.map((v) => (v.value ? v.value.width : 0));
    return {
      transform: [
        {
          translateX: interpolate(
            newPos,
            tabIndices,
            itemOffsets,
            Extrapolate.CLAMP
          ),
        },
      ],
      width: interpolate(newPos, tabIndices, tabWidths, Extrapolate.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingHorizontal: 16,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          {
            height: 2,
            width: "100%",
          },
          tw.style(`bg-gray-900 dark:bg-gray-100`),
        ]}
      />
      {/* <View
        sx={{
          backgroundColor: isDark
            ? "rgba(229, 231, 235, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          padding: 16,
          borderRadius: 999,
        }}
      /> */}
    </Animated.View>
  );
};

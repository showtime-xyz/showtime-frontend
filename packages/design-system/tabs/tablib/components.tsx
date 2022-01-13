import { Platform, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  Extrapolate,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
import React from "react";
import { tw } from "design-system/tailwind";
import { View } from "../../view";
import { Text } from "../../text";
import { useTabIndexContext, useTabsContext } from "../tablib";
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
          marginHorizontal: 16,
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

  const isDark = useIsDarkMode();

  const { offset, position, tabItemLayouts } = useTabsContext();

  const itemOffsets = useDerivedValue(() => {
    let result = [];

    for (let i = 0; i < tabItemLayouts.length; i++) {
      if (tabItemLayouts[i].value) {
        result.push(tabItemLayouts[i].value!.x);
      }
    }
    return result;
  }, [tabItemLayouts]);

  const animatedStyle = useAnimatedStyle(() => {
    if (itemOffsets.value.length === 0) {
      return {};
    }

    const input = itemOffsets.value.map((_v, i) => i);
    const output = tabItemLayouts.map((item) => item.value?.width ?? 0);

    const newPos = position.value + offset.value;
    return {
      width: interpolate(newPos, input, output, Extrapolate.CLAMP),
      transform: [
        {
          translateX: interpolate(
            newPos,
            input,
            itemOffsets.value,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          height: "100%",
          justifyContent: "center",
        },
        animatedStyle,
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
          paddingY: 16,
          borderRadius: 999,
        }}
      />
    </Animated.View>
  );
};

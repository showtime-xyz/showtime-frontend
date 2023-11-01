import { useState } from "react";

import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  FadeIn,
  Layout,
} from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

export type ToggleOption = { title: string; value: string };
export const Toggle = ({
  options,
  value,
  onChange,
  tw,
  ...rest
}: {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
} & ViewProps) => {
  const isDark = useIsDarkMode();
  const optionsWidth = useSharedValue<{
    [index: number]: number;
  }>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const index = options.findIndex((item) => item.value === value);
  const animatedStyle = useAnimatedStyle(() => {
    const currentOptionWidth =
      index <= 0
        ? optionsWidth.value[index] + 4
        : optionsWidth.value[index] + 2;
    const currentOptionX = index <= 0 ? -2 : optionsWidth.value[index - 1];

    return {
      transform: [
        {
          translateX: withTiming(currentOptionX, {
            duration: 150,
          }),
        },
      ],
      width: withTiming(currentOptionWidth, {
        duration: 150,
      }),
    };
  }, [value, options, index, optionsWidth.value]);

  return (
    <View
      tw={[
        "flex-row rounded-md border border-gray-300 dark:border-gray-600",
        tw,
      ].join(" ")}
      {...rest}
    >
      {isLoaded ? (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              height: "101%",
              top: "-1%",
              borderRadius: 6,
              backgroundColor: isDark ? colors.white : colors.gray[900],
            },
          ]}
          entering={FadeIn}
        />
      ) : null}
      {options.map((item, index) => (
        <Pressable
          key={item.value}
          tw={["items-start self-start px-4 py-1"]}
          onPress={() => onChange(item.value)}
          onLayout={({
            nativeEvent: {
              layout: { width },
            },
          }) => {
            const tabs = Object.assign(optionsWidth.value, {
              [index]: width,
            });
            if (Object.keys(optionsWidth.value).length === options.length) {
              setIsLoaded(true);
              optionsWidth.value = tabs;
            }
          }}
        >
          <Text
            tw={[
              "text-sm font-semibold transition-colors duration-150",
              value === item.value
                ? "text-white dark:text-gray-900"
                : "text-gray-900 dark:text-white",
            ]}
          >
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

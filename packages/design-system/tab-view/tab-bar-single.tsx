import { useState } from "react";

import { AnimatePresence, View as MotiView } from "moti";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Route } from "./";

type IndependentTabBarProps = {
  routes: Route[];
  index: number;
  onPress?: (index: number) => void;
};
const PADDING_X = 16;

const getTextColor = (isFocus: boolean) =>
  isFocus ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400";

export const TabBarSingle = ({
  routes,
  index: propIndex,
  onPress,
}: IndependentTabBarProps) => {
  const isDark = useIsDarkMode();
  const [tabsWidth, setTabsWidth] = useState<{
    [index: number]: number;
  }>({});

  const outputRange = routes.reduce<number[]>((acc, _, i) => {
    if (i === 0) return [PADDING_X];
    return [...acc, acc[i - 1] + tabsWidth[i - 1] + PADDING_X * 2];
  }, []);

  return (
    <View tw="flex-row">
      {routes.map((item, index) => (
        <Pressable
          onPress={() => onPress?.(index)}
          style={{
            paddingHorizontal: PADDING_X,
          }}
          key={item.key}
        >
          <View
            onLayout={({
              nativeEvent: {
                layout: { width },
              },
            }) => {
              const tabs = Object.assign(tabsWidth, {
                [index]: width,
              });
              if (Object.keys(tabsWidth).length === routes.length) {
                setTabsWidth({ ...tabs });
              }
            }}
            tw="py-4"
          >
            <Text tw={["text-sm font-bold", getTextColor(propIndex === index)]}>
              {item.title}
              {Boolean(item.subtitle) && (
                <Text tw="text-xs font-semibold text-gray-400">
                  {` ${item.subtitle}`}
                </Text>
              )}
            </Text>
          </View>
        </Pressable>
      ))}
      <AnimatePresence>
        <MotiView
          style={{
            position: "absolute",
            bottom: 0,
            height: 2,
            backgroundColor: isDark ? "#FFF" : colors.gray[900],
          }}
          from={{ opacity: 0 }}
          animate={{
            width: tabsWidth[propIndex],
            transform: [
              {
                translateX: outputRange[propIndex],
              },
            ],
            opacity: 1,
          }}
          transition={{ type: "timing", duration: 300 }}
        />
      </AnimatePresence>
    </View>
  );
};

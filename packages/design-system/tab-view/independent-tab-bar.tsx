import { useState } from "react";

import { AnimatePresence, View as MotiView } from "moti";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Route } from "./src/types";

type IndependentTabBarProps = {
  routes: Route[];
  index: number;
  onPress?: (index: number) => void;
};
const PADDING_X = 16;
export const IndependentTabBar = ({
  routes,
  index: propIndex,
  onPress,
}: IndependentTabBarProps) => {
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
            onLayout={({ nativeEvent: { layout } }) => {
              setTabsWidth(
                Object.assign(tabsWidth, {
                  [index]: layout.width,
                })
              );
            }}
            tw="py-4"
          >
            <Text tw="text-sm font-bold text-black dark:text-white">
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
      {/* @ts-ignore */}
      <AnimatePresence>
        <MotiView
          style={[
            tw.style("absolute bottom-0 h-0.5 bg-gray-900 dark:bg-white"),
          ]}
          animate={{
            width: tabsWidth[propIndex],
            transform: [
              {
                translateX: outputRange[propIndex],
              },
            ],
          }}
          transition={{ type: "timing" }}
        />
      </AnimatePresence>
    </View>
  );
};

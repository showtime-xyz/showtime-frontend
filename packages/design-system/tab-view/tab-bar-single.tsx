import { useState, memo, useMemo } from "react";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Route } from "./";

type IndependentTabBarProps = {
  routes: Route[];
  index: number;
  onPress?: (index: number) => void;
  tw?: string;
};
const PADDING_X = 16;

const getTextColor = (isFocus: boolean) =>
  isFocus ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400";

export const TabBarSingle = memo<IndependentTabBarProps>(
  function IndependentTabBarProps({
    routes,
    index: propIndex,
    onPress,
    tw = "",
  }) {
    const [tabsWidth, setTabsWidth] = useState<{
      [index: number]: number;
    }>({});

    const outputRange = useMemo(
      () =>
        routes.reduce<number[]>((acc, _, i) => {
          if (i === 0) return [PADDING_X];
          return [...acc, acc[i - 1] + tabsWidth[i - 1] + PADDING_X * 2];
        }, []),
      [routes, tabsWidth]
    );

    return (
      <View
        tw={["no-scrollbar flex-row overflow-x-auto overflow-y-hidden", tw]}
      >
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
              <Text
                tw={["text-sm font-bold", getTextColor(propIndex === index)]}
              >
                {item.title}
                {Boolean(item.subtitle) && (
                  <Text tw="text-xs font-semibold text-gray-500">
                    {` ${item.subtitle}`}
                  </Text>
                )}
              </Text>
            </View>
          </Pressable>
        ))}
        <View
          tw="animate-fade-in absolute bottom-0 h-[2px] bg-gray-900 transition-all dark:bg-white"
          style={{
            width: tabsWidth[propIndex],
            transform: [
              {
                translateX: outputRange[propIndex],
              },
            ],
          }}
        />
      </View>
    );
  }
);

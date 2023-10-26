import { memo, useState, useMemo } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Route } from ".";

type TabBarVerticalProps = {
  routes: Route[];
  index: number;
  onPress?: (index: number) => void;
  tw?: string;
};
const OFFSET = 16;

export const TabBarVertical = memo<TabBarVerticalProps>(
  function TabBarVertical({ routes, index: propIndex, onPress, tw = "" }) {
    const isDark = useIsDarkMode();
    const [tabsHeight, setTabsHeight] = useState<{
      [index: number]: number;
    }>({});

    const outputRange = useMemo(
      () =>
        routes.reduce<number[]>((acc, _, i) => {
          if (i === 0) return [OFFSET];
          return [...acc, acc[i - 1] + tabsHeight[i - 1]];
        }, []),
      [routes, tabsHeight]
    );

    return (
      <View tw={["mt-8", tw]}>
        {routes.map((item, index) => (
          <Pressable
            tw="flex-row items-center justify-between rounded-2xl px-3 py-5 transition-all hover:bg-gray-100 hover:dark:bg-gray-900"
            key={item.key}
            onPress={() => onPress?.(index)}
            onLayout={({
              nativeEvent: {
                layout: { height },
              },
            }) => {
              const tabs = Object.assign(tabsHeight, {
                [index]: height,
              });
              if (Object.keys(tabsHeight).length === routes.length) {
                setTabsHeight({ ...tabs });
              }
            }}
          >
            <Text
              tw={[
                "text-lg leading-6 text-black duration-300 dark:text-white",
                propIndex === index ? "font-bold" : "font-medium",
              ]}
            >
              {item.title}
            </Text>
          </Pressable>
        ))}
        <View
          tw="animate-fade-in absolute right-2 transition-all"
          style={{
            transform: [
              {
                translateY: outputRange[propIndex],
              },
            ],
          }}
        >
          <ChevronRight
            width={24}
            height={24}
            color={isDark ? colors.white : colors.black}
          />
        </View>
      </View>
    );
  }
);

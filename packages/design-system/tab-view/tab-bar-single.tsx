import { useState, memo, useMemo, useLayoutEffect, useRef } from "react";
import { Platform } from "react-native";

import type { SceneMap } from "react-native-tab-view";

import { PressableHover } from "@showtime-xyz/universal.pressable-hover";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Route, SceneProps } from "./";

type IndependentTabBarProps = {
  routes: Route[];
  index: number;
  onPress?: (index: number) => void;
  tw?: string;
  disableScrollableBar?: boolean;
  renderIcon?: (scene: {
    focused: boolean;
    color: string;
    route: Route;
  }) => React.ReactNode;
};
const PADDING_X = 16;

const getTextColor = (isFocus: boolean) =>
  isFocus ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400";

export const TabBarSingle = memo<IndependentTabBarProps>(function TabBarSingle({
  routes,
  index: propIndex,
  onPress,
  tw = "",
  disableScrollableBar = false,
  renderIcon,
}) {
  const [tabsWidth, setTabsWidth] = useState<{
    [index: number]: number;
  }>({});
  const tabsContainer = useRef(null);
  const outputRange = useMemo(
    () =>
      routes.reduce<number[]>((acc, _, i) => {
        if (i === 0) return [PADDING_X];
        return [...acc, acc[i - 1] + tabsWidth[i - 1] + PADDING_X * 2];
      }, []),
    [routes, tabsWidth]
  );
  useLayoutEffect(() => {
    if (Platform.OS === "web" && propIndex > 0) {
      const scrollToX = new Array(propIndex).fill(0).reduce((acc, _, i) => {
        return acc + tabsWidth[i] + PADDING_X * 2;
      }, 0);
      (tabsContainer.current as any)?.scrollTo(scrollToX, 0);
    }
  }, [propIndex, tabsWidth]);
  return (
    <View
      ref={tabsContainer}
      tw={["no-scrollbar flex-row overflow-x-auto overflow-y-hidden", tw]}
    >
      {routes.map((item, index) => (
        <PressableHover
          onPress={() => onPress?.(index)}
          style={{
            paddingHorizontal: PADDING_X,
          }}
          key={item.key}
          tw={disableScrollableBar ? "flex-1" : ""}
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
            tw={["flex-row items-center py-4"]}
          >
            {renderIcon?.({
              focused: propIndex === index,
              color: "#000",
              route: item,
            })}
            <Text tw={["text-sm font-bold", getTextColor(propIndex === index)]}>
              {item.title}
              {Boolean(item.subtitle) && (
                <Text tw="text-xs font-semibold text-gray-500">
                  {` ${item.subtitle}`}
                </Text>
              )}
            </Text>
          </View>
        </PressableHover>
      ))}
      <View
        tw="animate-fade-in absolute bottom-0 h-[2px] bg-gray-900 transition-all dark:bg-white"
        style={{
          width: tabsWidth[propIndex],
          transform: `translateX(${outputRange[propIndex]}px)` as any,
        }}
      />
    </View>
  );
});

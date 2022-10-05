import React, { memo } from "react";
import { Platform, StyleSheet } from "react-native";

import { BlurView, BlurTint } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

const renderComponent = (Component: any) => {
  if (!Component) return null;
  if (React.isValidElement(Component)) return Component;
  return <Component />;
};
export type HeaderProps = {
  headerLeft?: React.ComponentType<any> | React.ReactElement | undefined;
  headerCenter?: React.ComponentType<any> | React.ReactElement | undefined;
  headerRight?: React.ComponentType<any> | React.ReactElement | undefined;
  translateYValue?: Animated.SharedValue<number>;
  disableCenterAnimation?: boolean;
};

export const Header = memo<HeaderProps>(function Header({
  headerLeft,
  headerCenter,
  headerRight,
  translateYValue,
  disableCenterAnimation = false,
}) {
  const { colorScheme } = useColorScheme();
  const { top } = useSafeAreaInsets();
  const headerHeight = top + 44;
  const animationBackgroundStyles = useAnimatedStyle(() => {
    if (!translateYValue) return {};
    return {
      opacity: interpolate(-translateYValue.value, [top, headerHeight], [0, 1]),
    };
  });
  const animationCenterStyles = useAnimatedStyle(() => {
    if (!translateYValue || disableCenterAnimation) return {};
    return {
      // Todo: add fadeInUp effect
      opacity: interpolate(-translateYValue.value, [top, headerHeight], [0, 1]),
    };
  });
  return (
    <View
      tw="absolute top-0 z-10 w-full items-center overflow-hidden"
      style={[
        {
          paddingTop: top,
          height: headerHeight,
        },
      ]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFillObject, animationBackgroundStyles]}
      >
        {Platform.select({
          ios: (
            <BlurView
              style={StyleSheet.absoluteFill}
              tint={colorScheme as BlurTint}
              intensity={85}
            />
          ),
          default: (
            <View tw="bg-white dark:bg-black" style={StyleSheet.absoluteFill} />
          ),
        })}
      </Animated.View>
      <View tw="w-full flex-row flex-nowrap items-center px-3">
        <View style={{ flex: 1, alignItems: "flex-start", maxWidth: 60 }}>
          {renderComponent(headerLeft)}
        </View>

        <Animated.View
          style={[
            {
              flex: 1,
              alignItems: "center",
            },
            animationCenterStyles,
          ]}
        >
          {renderComponent(headerCenter)}
        </Animated.View>

        <View style={{ flex: 1, maxWidth: 60, alignItems: "flex-end" }}>
          {renderComponent(headerRight)}
        </View>
      </View>
    </View>
  );
});
export const SearchInHeader = () => null;
export const NotificationsInHeader = () => <></>;

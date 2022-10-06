import React, { memo } from "react";
import { Platform, StyleSheet } from "react-native";

import { BlurView } from "@react-native-community/blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

export const DEFAULT_HADER_HEIGHT = 44;
const renderComponent = (Component: any) => {
  if (!Component) return null;
  if (React.isValidElement(Component)) return Component;
  return <Component />;
};
export type HeaderProps = {
  headerLeft?: React.ComponentType<any> | React.ReactElement | null;
  headerCenter?: React.ComponentType<any> | React.ReactElement | null;
  headerRight?: React.ComponentType<any> | React.ReactElement | null;
  translateYValue?: Animated.SharedValue<number>;
  disableCenterAnimation?: boolean;
  canGoBack?: boolean;
};

export const Header = memo<HeaderProps>(function Header({
  headerLeft,
  headerCenter,
  headerRight,
  translateYValue,
  disableCenterAnimation = false,
}) {
  const { top } = useSafeAreaInsets();
  const headerHeight = top + DEFAULT_HADER_HEIGHT;
  const animationBackgroundStyles = useAnimatedStyle(() => {
    if (!translateYValue) return {};
    return {
      opacity: interpolate(-translateYValue.value, [top, headerHeight], [0, 1]),
    };
  });
  const animationCenterStyles = useAnimatedStyle(() => {
    if (!translateYValue || disableCenterAnimation) return {};

    return {
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
        <BlurView
          style={StyleSheet.absoluteFill}
          blurAmount={30}
          {...Platform.select({
            ios: {
              blurType: "ultraThinMaterialDark",
            },
            default: {
              blurType: "dark",
              overlayColor: "rgba(0,0,0,.2)",
            },
          })}
        />
      </Animated.View>
      <View tw="h-full w-full flex-row flex-nowrap justify-center px-4">
        <View tw="max-w-[80px] flex-1 items-start justify-center">
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

        <View tw="max-w-[80px] flex-1 items-end justify-center">
          {renderComponent(headerRight)}
        </View>
      </View>
    </View>
  );
});
export const SearchInHeader = () => null;
export const NotificationsInHeader = () => <></>;

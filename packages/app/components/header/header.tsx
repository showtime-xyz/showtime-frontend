import React, { memo } from "react";
import { StyleSheet, Platform } from "react-native";

import { BlurView } from "@react-native-community/blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { HeaderLeft } from "./header-left";

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
  disableBlur?: boolean;
  tw?: string;
  withBackground?: boolean;
  color?: string;
};

export const Header = memo<HeaderProps>(function Header({
  headerLeft,
  headerCenter,
  headerRight,
  translateYValue,
  disableCenterAnimation = false,
  disableBlur = false,
  tw = "",
  canGoBack,
  withBackground = false,
  color,
}) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const isRootScreen = router.asPath === "/";
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
      tw={["absolute top-0 z-10 w-full items-center overflow-hidden", tw]}
      style={[
        {
          paddingTop: top,
          height: headerHeight,
        },
      ]}
    >
      {!disableBlur ? (
        Platform.OS === "android" ? (
          // Reanimated View behaves weird on android here. Probably when BlurView is nested and Animated View is absolute.
          // TODO: make a reproducible example and report to reanimated
          <Animated.View
            style={[
              animationBackgroundStyles,
              {
                height: headerHeight,
                width: "100%",
                position: "absolute",
                backgroundColor: colors.gray[600],
              },
            ]}
          />
        ) : (
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
        )
      ) : null}
      <View tw="h-full w-full flex-row flex-nowrap justify-center px-4">
        <View tw="max-w-[80px] flex-1 items-start justify-center">
          {headerLeft ? (
            renderComponent(headerLeft)
          ) : (
            <HeaderLeft
              canGoBack={canGoBack ?? isRootScreen}
              withBackground={withBackground}
              color={color}
            />
          )}
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

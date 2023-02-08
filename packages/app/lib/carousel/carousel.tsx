import { useRef, useCallback } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import RNRCarousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { Controller } from "./controller";
import { CarouselProps } from "./types";

export function Carousel({
  pagination = false,
  controller = false,
  data,
  controllerTw = "",
  onProgressChange,
  ...rest
}: CarouselProps) {
  const progressValue = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const animationStyle = useCallback((value: number) => {
    "worklet";
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
    const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);

    return {
      transform: [{ scale }],
      zIndex,
      opacity,
    };
  }, []);
  return (
    <>
      {pagination && !!progressValue && (
        <View tw="mt-10 flex-row justify-center">
          {data.map((_, index) => {
            return (
              <PaginationItem
                animValue={progressValue}
                index={index}
                key={index}
                length={data.length}
              />
            );
          })}
        </View>
      )}
      <RNRCarousel
        ref={carouselRef}
        data={data}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
          onProgressChange?.(_, absoluteProgress);
        }}
        customAnimation={animationStyle}
        {...rest}
      />
      {controller && data.length > 0 && (
        <Controller
          prev={() => carouselRef.current?.prev()}
          next={() => carouselRef.current?.next()}
          tw={controllerTw}
        />
      )}
    </>
  );
}
const PaginationItem: React.FC<{
  index: number;
  length: number;
  animValue: Animated.SharedValue<number>;
  isRotate?: boolean;
}> = ({ animValue, index, length, isRotate }) => {
  const width = 8;
  const isDark = useIsDarkMode();
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      tw="ml-2 h-2 w-2 overflow-hidden rounded-full"
      style={{ backgroundColor: isDark ? colors.gray[500] : colors.gray[200] }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor: isDark ? colors.white : colors.gray[400],
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

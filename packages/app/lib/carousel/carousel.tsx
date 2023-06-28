import { useRef, useCallback, useMemo } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import RNRCarousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { colors, styled } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { CarouselProps } from "./types";

const StyledRNRCarousel = styled(RNRCarousel);
export function Carousel({
  pagination,
  controller = false,
  data,
  controllerTw = "",
  effect,
  onProgressChange,
  ...rest
}: CarouselProps) {
  const progressValue = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const fadeAnimationStyle = useCallback((value: number) => {
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
  const effectAnimation = useMemo(() => {
    if (effect === "fade") {
      return fadeAnimationStyle;
    }
    return undefined;
  }, [effect, fadeAnimationStyle]);
  return (
    <View>
      <StyledRNRCarousel
        ref={carouselRef}
        data={data}
        onProgressChange={(_, absoluteProgress) => {
          progressValue.value = absoluteProgress;
          onProgressChange?.(_, absoluteProgress);
        }}
        customAnimation={effectAnimation}
        {...rest}
      />
      {pagination && !!progressValue && data.length > 1 && (
        <View
          tw={[
            "absolute bottom-2 z-10 w-full flex-row items-center justify-center",
            pagination.tw || "",
          ]}
          style={{ zIndex: 999 }}
        >
          {data.map((_, index) => {
            const PaginationItem =
              pagination.variant === "dot"
                ? PaginationDotItem
                : PaginationRectangleItem;
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
      {/* {controller && data.length > 0 && (
        <Controller
          prev={() => carouselRef.current?.prev()}
          next={() => carouselRef.current?.next()}
          tw={controllerTw}
        />
      )} */}
    </View>
  );
}
type PaginationItemProps = {
  index: number;
  length: number;
  animValue: Animated.SharedValue<number>;
  isRotate?: boolean;
};
const PaginationDotItem: React.FC<PaginationItemProps> = ({
  animValue,
  index,
  length,
}) => {
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

const PaginationRectangleItem: React.FC<PaginationItemProps> = ({
  animValue,
  index,
  length,
}) => {
  const width = 24;
  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [width / 2, width, width / 2];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [width / 2, width, width / 2];
    }

    return {
      width: interpolate(
        animValue?.value,
        inputRange,
        outputRange,
        Extrapolate.CLAMP
      ),
    };
  }, [animValue, index, length]);
  return (
    <View tw="ml-2 h-2 overflow-hidden rounded-full bg-white">
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor: colors.white,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

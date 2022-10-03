import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import { Skeleton } from "@showtime-xyz/universal.skeleton";
import { View } from "@showtime-xyz/universal.view";

import { breakpoints } from "design-system/theme";

type CardSkeletonProps = {
  squareSize: number;
  spacing: number;
  tw?: string;
  height?: number;
  width?: number;
};

export const CardSkeleton = memo<CardSkeletonProps>(
  ({
    squareSize,
    height: propHeight,
    width: propWidth,
    spacing = 0,
    tw = "",
  }) => {
    const { colorScheme } = useColorScheme();
    const { width } = useWindowDimensions();
    const isMdWidth = width >= breakpoints["md"];
    if (isMdWidth) {
      return (
        <View
          tw={[
            "dark:shadow-dark shadow-light mb-4 flex-1 overflow-hidden rounded-2xl",
            tw,
          ]}
        >
          <View tw="py-2 px-4">
            <View tw="flex-row">
              <Skeleton
                width={32}
                height={32}
                radius={32}
                show
                // @ts-ignore
                colorMode={colorScheme}
              />
              <View tw="ml-2">
                <Skeleton
                  width={140}
                  height={14}
                  show
                  // @ts-ignore
                  colorMode={colorScheme}
                />
                <View tw="mt-1" />
                <Skeleton
                  width={90}
                  height={14}
                  show
                  // @ts-ignore
                  colorMode={colorScheme}
                />
              </View>
            </View>
          </View>
          <Skeleton
            width={squareSize}
            height={squareSize}
            show
            // @ts-ignore
            colorMode={colorScheme}
            radius={0}
          />
          <View tw="py-2 px-4">
            <Skeleton
              width={140}
              height={16}
              show
              // @ts-ignore
              colorMode={colorScheme}
            />
            <View tw="h-2" />
            <Skeleton
              width={90}
              height={14}
              show
              // @ts-ignore
              colorMode={colorScheme}
            />
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          width: squareSize,
        }}
      >
        <Skeleton
          width={squareSize}
          height={squareSize}
          show
          // @ts-ignore
          colorMode={colorScheme}
          radius={0}
        />
      </View>
    );
  }
);

CardSkeleton.displayName = "CardSkeleton";

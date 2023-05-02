import { memo } from "react";
import { useWindowDimensions } from "react-native";

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
  ({ squareSize, tw = "" }) => {
    const { width } = useWindowDimensions();
    const isMdWidth = width >= breakpoints["md"];
    if (isMdWidth) {
      return (
        <View tw={["mb-4 flex-1 overflow-hidden rounded-2xl", tw]}>
          <View tw="px-4 py-2">
            <View tw="flex-row">
              <Skeleton width={32} height={32} radius={32} show />
              <View tw="ml-2">
                <Skeleton width={140} height={14} show />
                <View tw="mt-1" />
                <Skeleton width={90} height={14} show />
              </View>
            </View>
          </View>
          <Skeleton width={squareSize} height={squareSize} show radius={0} />
          <View tw="px-4 py-2">
            <Skeleton width={140} height={16} show />
            <View tw="h-2" />
            <Skeleton width={90} height={14} show />
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
        <Skeleton width={squareSize} height={squareSize} show radius={0} />
      </View>
    );
  }
);

CardSkeleton.displayName = "CardSkeleton";

import { memo } from "react";

import { View } from "@showtime-xyz/universal.view";

import { CardSkeleton } from "app/components/card/card-skeleton";
import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

type ProfileFooterProps = {
  isLoading: boolean;
  numColumns?: number;
};

export const ProfileFooter = memo(
  ({ isLoading, numColumns = 3 }: ProfileFooterProps) => {
    const contentWidth = useContentWidth();
    const squareSize = contentWidth / numColumns;
    const tabBarHeight = usePlatformBottomHeight();

    if (isLoading) {
      return (
        <View style={{ marginBottom: tabBarHeight }} tw="mt-0 flex-row md:mt-4">
          {new Array(numColumns).fill(0).map((_, i) => (
            <CardSkeleton
              squareSize={squareSize}
              spacing={32}
              key={`Card-Skeleton-${i}`}
            />
          ))}
        </View>
      );
    }
    return <View style={{ height: tabBarHeight }} tw="mb-4" />;
  }
);

ProfileFooter.displayName = "ProfileFooter";

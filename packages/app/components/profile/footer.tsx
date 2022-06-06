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
        <View tw={`flex-row mb-[${tabBarHeight}px]`}>
          {new Array(numColumns).fill(0).map((_, i) => (
            <CardSkeleton squareSize={squareSize} key={`Card-Skeleton-${i}`} />
          ))}
        </View>
      );
    }
    return <View tw={`h-[${tabBarHeight}px] mb-4`} />;
  }
);

ProfileFooter.displayName = "ProfileFooter";

import { memo } from "react";

import useContentWidth from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

import { View } from "design-system";
import { CardSkeleton } from "design-system/card/card-skeleton";

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

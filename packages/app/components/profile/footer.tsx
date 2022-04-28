import { memo, useContext } from "react";

import useContentWidth from "app/hooks/use-content-width";
import {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
} from "app/lib/react-navigation/bottom-tabs";

import { Skeleton, View } from "design-system";
import { useColorScheme } from "design-system/hooks";

type ProfileFooterProps = {
  isLoading: boolean;
  numColumns: number;
};
export const ProfileFooter = memo(
  ({ isLoading, numColumns = 3 }: ProfileFooterProps) => {
    const colorMode = useColorScheme();
    const contentWidth = useContentWidth();

    const squareSize = (contentWidth - 32 * numColumns) / numColumns;
    const tabBarHeight = useContext(BottomTabBarHeightContext)
      ? useBottomTabBarHeight()
      : 0;

    if (isLoading) {
      return (
        <View tw={`flex-row mb-[${tabBarHeight}px] mt-4`}>
          {new Array(numColumns).fill(0).map((_, i) => (
            <View
              tw="mx-4 overflow-hidden rounded-2xl"
              key={`ProfileFooter-Skeleton-${i}`}
            >
              <Skeleton
                colorMode={colorMode}
                height={squareSize}
                width={squareSize}
                radius={0}
              />
            </View>
          ))}
        </View>
      );
    }

    return <View tw={`h-[${tabBarHeight}px]`} />;
  }
);

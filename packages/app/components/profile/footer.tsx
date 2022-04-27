import { memo, useContext, useMemo } from "react";
import { useWindowDimensions } from "react-native";

import { MAX_CONTENT_WIDTH } from "app/constants/layout";
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
    const { width } = useWindowDimensions();

    const contentWidth = useMemo(
      () => (width < MAX_CONTENT_WIDTH ? width : MAX_CONTENT_WIDTH),
      [width]
    );
    const squareSize = (contentWidth - 32 * numColumns) / numColumns;
    const tabBarHeight = useContext(BottomTabBarHeightContext)
      ? useBottomTabBarHeight()
      : 0;

    if (isLoading) {
      return (
        <View tw={`flex-row mb-[${tabBarHeight}px] mt-4`}>
          {new Array(numColumns).fill(0).map((_, i) => (
            <View
              tw="mx-4 rounded-2xl overflow-hidden"
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

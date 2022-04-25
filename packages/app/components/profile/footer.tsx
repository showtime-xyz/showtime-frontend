import { useContext } from "react";
import { useWindowDimensions } from "react-native";

import {
  BottomTabBarHeightContext,
  useBottomTabBarHeight,
} from "app/lib/react-navigation/bottom-tabs";

import { Skeleton, View } from "design-system";
import { useColorScheme } from "design-system/hooks";

export const ProfileFooter = ({ isLoading }: { isLoading: boolean }) => {
  const colorMode = useColorScheme();
  const { width } = useWindowDimensions();
  const squareSize = width / 3;
  const tabBarHeight = useContext(BottomTabBarHeightContext)
    ? useBottomTabBarHeight()
    : 0;

  if (isLoading) {
    return (
      <View tw={`flex-row mb-[${tabBarHeight}px]`}>
        <View tw="mt-[1px] mr-[1px]">
          <Skeleton
            colorMode={colorMode}
            height={squareSize}
            width={squareSize}
            radius={0}
          />
        </View>
        <View tw="mt-[1px] mx-[1px]">
          <Skeleton
            colorMode={colorMode}
            height={squareSize}
            width={squareSize - 2}
            radius={0}
          />
        </View>
        <View tw="mt-[1px] ml-[1px]">
          <Skeleton
            colorMode={colorMode}
            height={squareSize}
            width={squareSize}
            radius={0}
          />
        </View>
      </View>
    );
  }

  return <View tw={`h-[${tabBarHeight}px]`} />;
};

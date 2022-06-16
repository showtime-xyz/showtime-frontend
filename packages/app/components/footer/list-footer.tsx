import { memo } from "react";

import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";

import { Spinner } from "design-system/spinner";
import { View } from "design-system/view";

const LIST_FOOTER_HEIGHT = 80;
type ListFooterProps = {
  isLoading: boolean;
  height?: number;
};
export const ListFooter = memo<ListFooterProps>(function ListFooter({
  isLoading,
  height = LIST_FOOTER_HEIGHT,
}) {
  const tabBarHeight = useBottomTabBarHeight();

  if (isLoading) {
    return (
      <View
        tw={`mt-6 items-center justify-center px-3`}
        style={{ marginBottom: tabBarHeight, height }}
      >
        <Spinner size="small" />
      </View>
    );
  }

  return <View style={{ marginBottom: tabBarHeight }}></View>;
});

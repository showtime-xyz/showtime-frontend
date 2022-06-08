import { memo } from "react";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { useBottomTabBarHeight } from "app/lib/react-navigation/bottom-tabs";

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

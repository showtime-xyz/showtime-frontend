import { memo } from "react";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";

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
  const tabBarHeight = usePlatformBottomHeight();

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

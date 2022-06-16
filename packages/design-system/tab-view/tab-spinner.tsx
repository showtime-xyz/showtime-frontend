import { memo } from "react";

import { Spinner } from "design-system/spinner";
import { View } from "design-system/view";

import { TabScrollView } from "./tab-scene";

type TabLoadingProps = {
  index: number;
};

export const TabSpinner = memo<TabLoadingProps>(function TabSpinner({ index }) {
  return (
    <TabScrollView index={index}>
      <View tw="h-60 items-center justify-center">
        <Spinner size="small" />
      </View>
    </TabScrollView>
  );
});

import { memo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { TabScrollView } from "design-system/collapsible-tab-view";
import { Spinner } from "design-system/spinner";
import { View } from "design-system/view";

type TabLoadingProps = {
  index: number;
  style?: StyleProp<ViewStyle>;
};

export const TabSpinner = memo<TabLoadingProps>(function TabSpinner({
  index,
  style,
}) {
  return (
    <TabScrollView style={style} index={index}>
      <View tw="h-60 items-center justify-center">
        <Spinner size="small" />
      </View>
    </TabScrollView>
  );
});

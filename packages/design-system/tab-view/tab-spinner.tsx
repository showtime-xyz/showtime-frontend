import { memo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

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

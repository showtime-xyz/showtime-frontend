import { StyleSheet } from "react-native";

import { View } from "@showtime-xyz/universal.view";

export const SettingItemSeparator = ({ tw = "" }: { tw?: string }) => (
  <View
    tw={["bg-gray-200 dark:bg-gray-800", tw]}
    style={{ height: StyleSheet.hairlineWidth }}
  />
);

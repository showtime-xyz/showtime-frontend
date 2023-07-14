import { Platform } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export const Payout = ({ index = 0 }: { index: number }) => {
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Payout"
        desc="Manage your payout account information."
        descTw="mt-1"
      />
      <View tw="mt-6 px-4 lg:px-0"></View>
    </SettingScrollComponent>
  );
};

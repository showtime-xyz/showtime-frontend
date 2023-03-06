import { Linking, Platform } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { Showtime, Mail } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { SettingClearAppCache } from "../clear-cache-btn";
import { SettingItemSeparator } from "../setting-item-separator";
import {
  AccountSettingItem,
  SettingDeleteAccount,
} from "../settings-account-item";
import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type AccountTabProps = {
  index?: number;
};

export const AdvancedTab = ({ index = 0 }: AccountTabProps) => {
  const router = useRouter();
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Advanced"
        desc="Manage your account and additional options."
      />
      <View tw="mt-6 px-4 md:px-0">
        <AccountSettingItem
          title="Privacy & Security"
          onPress={() => router.push(`/settings/privacy-and-security`)}
          buttonText="View"
          Icon={Showtime}
        />
        <AccountSettingItem
          title="Feedback"
          onPress={() => Linking.openURL("mailto:help@showtime.xyz")}
          buttonText="Contact"
          Icon={Mail}
        />

        <SettingItemSeparator tw="my-4 md:my-8" />
        <SettingClearAppCache />
        <SettingDeleteAccount />
      </View>
    </SettingScrollComponent>
  );
};

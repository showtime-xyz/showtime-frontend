import { Platform } from "react-native";

import { Showtime, Mail } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { useSendFeedback } from "app/hooks/use-send-feedback";

import { SettingClearAppCache } from "../clear-cache-btn";
import { SettingItemSeparator } from "../setting-item-separator";
import {
  AccountSettingItem,
  SettingDeleteAccount,
} from "../settings-account-item";
import { SettingsTitle } from "../settings-title";

const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export type AdvancedTabProps = {
  index?: number;
};

export const AdvancedTab = ({ index = 0 }: AdvancedTabProps) => {
  const router = useRouter();
  const { onSendFeedback } = useSendFeedback();
  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Advanced"
        desc="Manage your account and additional options."
        descTw="mt-1"
      />
      <View tw="mt-6 px-4 lg:px-0">
        <AccountSettingItem
          title="Privacy & Security"
          onPress={() => router.push(`/settings/privacy-and-security`)}
          buttonText="View"
          Icon={Showtime}
        />

        <AccountSettingItem
          title="Feedback"
          onPress={onSendFeedback}
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

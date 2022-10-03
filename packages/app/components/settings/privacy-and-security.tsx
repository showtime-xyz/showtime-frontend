import { Platform } from "react-native";

import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { View } from "@showtime-xyz/universal.view";

import { useHeaderHeight } from "app/lib/react-navigation/elements";

import { SettingBody } from "./setting-content";
import { SettingHeaderSection } from "./setting-header";
import {
  AccountSettingItem,
  AccountSettingItemProps,
} from "./settings-account-slot";

const list = [
  {
    id: 1,
    title: "Blocked Accounts",
    icon: "lock",
    subRoute: "blocked-list",
  },
];

export const PrivacyAndSecuritySettings = () => {
  const headerHeight = useHeaderHeight();

  const renderSetting = (item: AccountSettingItemProps) => {
    return (
      <AccountSettingItem
        key={`privacy-and-security-setting-${item.id}`}
        {...item}
      />
    );
  };

  return (
    <ScrollView tw="w-full">
      {Platform.OS !== "android" && <View style={{ height: headerHeight }} />}
      <SettingHeaderSection title="Privacy & Security" />
      <SettingBody>{list.map(renderSetting)}</SettingBody>
    </ScrollView>
  );
};

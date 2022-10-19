import { useMemo } from "react";
import { Platform, ScrollView } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";

import {
  AccountSettingItem,
  SettingAccountSlotFooter,
  SettingAccountSlotHeader,
} from "../settings-account-slot";

const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;

export type AccountTabProps = {
  index?: number;
};

export const AccountTab = ({ index = 0 }: AccountTabProps) => {
  const accountSettings = useMemo(
    () => [
      {
        id: 1,
        title: "Privacy & Security",
        icon: "lock",
        subRoute: "privacy-and-security",
      },
    ],
    []
  );

  return (
    <SettingScrollComponent index={index}>
      <SettingAccountSlotHeader />
      {accountSettings?.length > 0 &&
        accountSettings.map((item) => (
          <AccountSettingItem {...item} key={item.id} />
        ))}
      <SettingAccountSlotFooter />
    </SettingScrollComponent>
  );
};

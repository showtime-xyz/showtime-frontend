import { useMemo } from "react";

import {
  AccountSettingItem,
  SettingAccountSlotFooter,
  SettingAccountSlotHeader,
} from "../settings-account-slot";
import { SettingScrollComponent } from "./index";

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

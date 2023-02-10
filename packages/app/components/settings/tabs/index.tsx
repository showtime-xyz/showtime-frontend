import { Route } from "@showtime-xyz/universal.tab-view";

import { WalletAddressesV2 } from "app/types";

import { AccountTab } from "./account";
import { BillingTab } from "./billing";
import { EmailTab } from "./email";
import { PhoneTab } from "./phone";
import { PushNotificationTab } from "./push-notifications";
import { WalletsTab } from "./wallets";

export type SettingTabsSceneProps = {
  route: Route;
  setEditingWallet: (v: WalletAddressesV2) => void;
};

export const SETTINGS_ROUTES = [
  {
    title: "Wallets",
    key: "Wallets",
    index: 0,
  },
  {
    title: "Email",
    key: "Email",
    index: 1,
  },
  {
    title: "Phone Number",
    key: "Phone",
    index: 2,
  },
  {
    title: "Accounts",
    key: "Account",
    index: 3,
  },
  {
    title: "Billing",
    key: "Billing",
    index: 4,
  },
  {
    title: "Push Notifications",
    key: "Push Notifications",
    index: 5,
  },
];
export const SettingTabsScene = ({
  route: { index, key },
  setEditingWallet,
}: SettingTabsSceneProps) => {
  switch (key) {
    case "Wallets":
      return <WalletsTab index={index} setEditingWallet={setEditingWallet} />;
    case "Email":
      return <EmailTab index={index} />;
    case "Phone":
      return <PhoneTab index={index} />;
    case "Account":
      return <AccountTab index={index} />;
    case "Billing":
      return <BillingTab index={index} />;
    case "Push Notifications":
      return <PushNotificationTab index={index} />;
    default:
      return null;
  }
};

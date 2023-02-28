import { Platform } from "react-native";

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
  },
  {
    title: "Email",
    key: "Email",
  },
  {
    title: "Phone Number",
    key: "Phone",
  },
  {
    title: "Accounts",
    key: "Account",
  },
  {
    title: "Billing",
    key: "Billing",
    hidden: Platform.OS !== "web",
  },
  {
    title: "Push Notifications",
    key: "Push Notifications",
  },
]
  .filter((item) => !item.hidden)
  .map((item, index) => ({ ...item, index }));

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

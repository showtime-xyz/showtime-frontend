import { Platform } from "react-native";

import { Route } from "@showtime-xyz/universal.tab-view";

import { WalletAddressesV2 } from "app/types";

import { AccountTab } from "./account";
import { AdvancedTab } from "./advanced";
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
    title: "Connected Accounts",
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
  {
    title: "Advanced",
    key: "Advanced",
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
    case "Advanced":
      return <AdvancedTab index={index} />;
    default:
      return null;
  }
};

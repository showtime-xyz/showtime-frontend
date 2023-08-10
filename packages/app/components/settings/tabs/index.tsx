import { Platform } from "react-native";

import { Route } from "@showtime-xyz/universal.tab-view";

import { WalletAddressesV2 } from "app/types";

import { AccountTab } from "./account";
import { AdvancedTab } from "./advanced";
import { BillingTab } from "./billing";
import { Payouts } from "./payouts";
import { PushNotificationTab } from "./push-notifications";
import { SignInTab } from "./sign-in";
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
    title: "Sign In",
    key: "Sign In",
  },
  {
    title: "Connected Apps",
    key: "Account",
  },
  {
    title: "Notifications",
    key: "Push Notifications",
  },
  {
    title: "Billing",
    key: "Billing",
    hidden: Platform.OS !== "web",
  },
  {
    title: "Advanced",
    key: "Advanced",
  },
  {
    title: "Bank Payouts",
    key: "Payouts",
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
    case "Sign In":
      return <SignInTab index={index} />;
    case "Account":
      return <AccountTab index={index} />;
    case "Billing":
      return <BillingTab index={index} />;
    case "Push Notifications":
      return <PushNotificationTab index={index} />;
    case "Advanced":
      return <AdvancedTab index={index} />;
    case "Payouts":
      return <Payouts index={index} />;
    default:
      return null;
  }
};

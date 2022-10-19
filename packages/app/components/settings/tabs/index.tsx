import { FlatList, Platform, ScrollView } from "react-native";

import {
  Route,
  TabFlatList,
  TabScrollView,
} from "@showtime-xyz/universal.tab-view";

import { WalletAddressesV2 } from "app/types";

import { AccountTab } from "./account";
import { EmailTab } from "./email";
import { PhoneTab } from "./phone";
import { PushNotificationTab } from "./push-notifications";
import { WalletsTab } from "./wallets";

export const SettingListComponent =
  Platform.OS === "web" ? FlatList : TabFlatList;
export const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;

export type SettingTabsSceneProps = {
  route: Route;
  setEditingWallet: (v: WalletAddressesV2) => void;
};
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
    case "Push Notifications":
      return <PushNotificationTab index={index} />;
    default:
      return null;
  }
};

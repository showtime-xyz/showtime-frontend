import { useEffect, useCallback } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { WalletAddressesV2 } from "app/types";

import { breakpoints } from "design-system/theme";

import {
  SettingsWalletSlot,
  SettingsWalletSlotHeader,
  SettingsWalletSlotPlaceholder,
  SettingsWalletSlotSkeleton,
} from "../settings-wallet-slot";
import { SlotSeparator } from "../slot-separator";

export type WalletsTabProps = {
  index?: number;
  setEditingWallet: (v: WalletAddressesV2) => void;
};
const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;

export const WalletsTab = ({
  index = 0,
  setEditingWallet,
}: WalletsTabProps) => {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  const wallets = user?.data.profile.wallet_addresses_v2;

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated, router]);
  const ListEmptyComponent = useCallback(() => {
    const hasNoWallet = Boolean(wallets);
    if (hasNoWallet) {
      return <SettingsWalletSlotPlaceholder />;
    }
    return <SettingsWalletSlotSkeleton />;
  }, [wallets]);

  return (
    <SettingScrollComponent index={index}>
      <SettingsWalletSlotHeader hasNoWallet={wallets?.length === 0} />

      {wallets?.length === 0 ? (
        ListEmptyComponent()
      ) : (
        <View>
          {wallets?.map((item) => (
            <View key={item.address}>
              <SettingsWalletSlot
                onEditNickname={() => setEditingWallet(item)}
                wallet={item}
              />
              {isMdWidth ? <View tw="mt-2" /> : <SlotSeparator />}
            </View>
          ))}
        </View>
      )}
    </SettingScrollComponent>
  );
};

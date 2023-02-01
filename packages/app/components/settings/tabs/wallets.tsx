import { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { useAddWallet } from "app/hooks/use-add-wallet";
import { useUser } from "app/hooks/use-user";
import { WalletAddressesV2 } from "app/types";

import { breakpoints } from "design-system/theme";

import { EmptyPlaceholder } from "../../empty-placeholder";
import { SettingsTitle } from "../settings-title";
import { SettingsWalletItem } from "../settings-wallet-item";
import { SlotSeparator } from "../slot-separator";

export type WalletsTabProps = {
  index?: number;
  setEditingWallet: (v: WalletAddressesV2) => void;
};
const SettingScrollComponent = Platform.OS === "web" ? View : TabScrollView;

export const WalletsTab = ({
  index = 0,
  setEditingWallet,
}: WalletsTabProps) => {
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const { state, addWallet } = useAddWallet();

  const wallets = user?.data.profile.wallet_addresses_v2;
  const walletCTA =
    state.status === "error" ? "Connect Lost, Retry" : "Add Wallet";
  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated, router]);

  return (
    <SettingScrollComponent index={index}>
      <SettingsTitle
        title="Your Wallets"
        desc="Your Primary Wallet will be the Polygon address that automatically receives your drops on Showtime."
        buttonText={walletCTA}
        onPress={addWallet}
      />
      {wallets?.length === 0 ? (
        <EmptyPlaceholder
          title={
            <Button tw="h-10 w-80" onPress={addWallet}>
              Connect Wallet
            </Button>
          }
          tw="h-full min-h-[60px]"
        />
      ) : (
        <View>
          {wallets?.map((item) => (
            <View key={item.address}>
              <SettingsWalletItem
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

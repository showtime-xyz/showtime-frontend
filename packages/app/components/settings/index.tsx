import { useState } from "react";
import { Dimensions, Platform } from "react-native";
import { WalletAddressesExcludingEmailV2, WalletAddressesV2 } from "app/types";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";
import { useUser } from "app/hooks/use-user";
import { View, Text } from "design-system";
import {
  EmailSlotProps,
  SettingsEmailSlot,
  SettingEmailSlotHeader,
  SettingsEmailSkeletonSlot,
} from "./settings-email-slot";
import {
  SettingsWalletSlot,
  SettingsWalletSlotHeader,
  SettingsWalletSlotSkeleton,
} from "./settings-wallet-slot";
import { ManageWallet } from "./manage-wallet";
import { SlotSeparator } from "./slot-separator";
import { TAB_LIST_HEIGHT } from "app/lib/constants";

const renderEmail = ({ item }: { item: EmailSlotProps }) => {
  const email = item.email;
  return <SettingsEmailSlot email={email} />;
};

const renderWallet = ({ item }: { item: WalletAddressesExcludingEmailV2 }) => {
  const address = item.address;
  const ensDomain = item.ens_domain;
  const mintingEnabled = item.minting_enabled;

  return (
    <SettingsWalletSlot
      address={address}
      ensDomain={ensDomain}
      mintingEnabled={mintingEnabled}
    />
  );
};

const SettingsTabs = () => {
  const [selected, setSelected] = useState(0);
  const [viewManagedWallet, setViewManagedWallet] = useState(false);
  const { user } = useUser();
  const emailWallets = user?.data.profile.wallet_addresses_v2.filter(
    (wallet) => wallet.is_email
  );
  const wallets = user?.data.profile.wallet_addresses_excluding_email_v2;
  const keyExtractor = (wallet: WalletAddressesV2) => wallet.address;

  return (
    <View tw="bg-white dark:bg-black flex-1">
      <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
            <Text tw="text-gray-900 dark:text-white font-bold text-3xl">
              Settings
            </Text>
          </View>
        </Tabs.Header>
        <Tabs.List
          contentContainerStyle={{
            justifyContent: "space-between",
            width: Dimensions.get("window").width,
          }}
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900`
          )}
        >
          <Tabs.Trigger>
            <TabItem name="Wallets" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Email Addresses" selected={selected === 1} />
          </Tabs.Trigger>
          <SelectedTabIndicator disableBackground={true} />
        </Tabs.List>
        <Tabs.Pager>
          <Tabs.FlatList
            data={wallets}
            keyExtractor={keyExtractor}
            renderItem={renderWallet}
            removeClippedSubviews={Platform.OS !== "web"}
            ListEmptyComponent={<SettingsWalletSlotSkeleton />}
            ListHeaderComponent={
              <SettingsWalletSlotHeader
                onPress={() => setViewManagedWallet(true)}
              />
            }
            alwaysBounceVertical={false}
            minHeight={Dimensions.get("window").height}
            ItemSeparatorComponent={() => <SlotSeparator />}
          />

          <Tabs.FlatList
            data={emailWallets}
            keyExtractor={keyExtractor}
            renderItem={renderEmail}
            removeClippedSubviews={Platform.OS !== "web"}
            ListEmptyComponent={<SettingsEmailSkeletonSlot />}
            ListHeaderComponent={
              <SettingEmailSlotHeader
                onPress={() => setViewManagedWallet(true)}
              />
            }
            alwaysBounceVertical={false}
            minHeight={Dimensions.get("window").height}
            ItemSeparatorComponent={() => <SlotSeparator />}
          />
        </Tabs.Pager>
      </Tabs.Root>
      <ManageWallet
        viewManagedWallet={viewManagedWallet}
        setViewManagedWallet={setViewManagedWallet}
      />
    </View>
  );
};

export function Settings() {
  return <SettingsTabs />;
}

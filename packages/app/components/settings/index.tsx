import { useState, useMemo, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";
import Constants from "expo-constants";

import { useUser } from "app/hooks/use-user";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { useRouter } from "app/navigation/use-router";
import { WalletAddressesExcludingEmailV2, WalletAddressesV2 } from "app/types";

import { View, Text } from "design-system";
import { Tabs, TabItem, SelectedTabIndicator } from "design-system/tabs";
import { tw } from "design-system/tailwind";

import {
  EmailSlotProps,
  SettingsEmailSlot,
  SettingEmailSlotHeader,
  SettingsEmailSkeletonSlot,
  SettingsEmailSlotPlaceholder,
} from "./settings-email-slot";
import {
  SettingsWalletSlot,
  SettingsWalletSlotHeader,
  SettingsWalletSlotSkeleton,
  SettingsWalletSlotPlaceholder,
} from "./settings-wallet-slot";
import { SlotSeparator } from "./slot-separator";

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
  const { user, isAuthenticated } = useUser();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const emailWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_email
      ),
    [user?.data.profile.wallet_addresses_v2]
  );
  const wallets = user?.data.profile.wallet_addresses_excluding_email_v2;
  const keyExtractor = (wallet: WalletAddressesV2) => wallet.address;

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated]);

  return (
    <View tw="bg-white dark:bg-black h-[100vh]">
      <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          {Platform.OS !== "android" && <View tw={`h-[${headerHeight}px]`} />}
          <View tw="bg-white dark:bg-black pt-4 px-4 pb-[3px] flex-row justify-between">
            <Text
              variant="text-2xl"
              tw="text-gray-900 dark:text-white font-extrabold"
            >
              Settings
            </Text>
            <Text
              variant="text-2xl"
              tw="text-gray-100 dark:text-gray-900 font-extrabold"
            >
              v{Constants.manifest.version}
            </Text>
          </View>
        </Tabs.Header>
        <Tabs.List
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900 w-screen`
          )}
        >
          <Tabs.Trigger>
            <TabItem name="Wallets" selected={selected === 0} />
          </Tabs.Trigger>

          <Tabs.Trigger>
            <TabItem name="Email Addresses" selected={selected === 1} />
          </Tabs.Trigger>
          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager>
          <Tabs.FlatList
            data={wallets}
            keyExtractor={keyExtractor}
            renderItem={renderWallet}
            removeClippedSubviews={Platform.OS !== "web"}
            ListEmptyComponent={() => {
              const hasNoWallet = Boolean(wallets);
              if (hasNoWallet) {
                return <SettingsWalletSlotPlaceholder />;
              }
              return <SettingsWalletSlotSkeleton />;
            }}
            ListHeaderComponent={<SettingsWalletSlotHeader />}
            alwaysBounceVertical={false}
            minHeight={Dimensions.get("window").height}
            ItemSeparatorComponent={() => <SlotSeparator />}
          />

          <Tabs.FlatList
            data={emailWallets}
            keyExtractor={keyExtractor}
            renderItem={renderEmail}
            removeClippedSubviews={Platform.OS !== "web"}
            ListEmptyComponent={() => {
              const hasNoEmails = Boolean(emailWallets);
              if (hasNoEmails) {
                return <SettingsEmailSlotPlaceholder />;
              }
              return <SettingsEmailSkeletonSlot />;
            }}
            ListHeaderComponent={<SettingEmailSlotHeader />}
            alwaysBounceVertical={false}
            minHeight={Dimensions.get("window").height}
            ItemSeparatorComponent={() => <SlotSeparator />}
          />
        </Tabs.Pager>
      </Tabs.Root>
    </View>
  );
};

export function Settings() {
  return <SettingsTabs />;
}

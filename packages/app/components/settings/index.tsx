import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

import Constants from "expo-constants";

import { useUser } from "app/hooks/use-user";
import { TAB_LIST_HEIGHT } from "app/lib/constants";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { useRouter } from "app/navigation/use-router";
import { WalletAddressesExcludingEmailV2, WalletAddressesV2 } from "app/types";

import { Text, View } from "design-system";
import { SelectedTabIndicator, TabItem, Tabs } from "design-system/tabs";
import { tw } from "design-system/tailwind";

import packageJson from "../../../../package.json";
import {
  AccountSettingItem,
  AccountSettingItemProps,
  SettingAccountSlotFooter,
  SettingAccountSlotHeader,
} from "./settings-account-slot";
import {
  EmailSlotProps,
  SettingEmailSlotHeader,
  SettingsEmailSkeletonSlot,
  SettingsEmailSlot,
  SettingsEmailSlotPlaceholder,
} from "./settings-email-slot";
import {
  SettingsWalletSlot,
  SettingsWalletSlotHeader,
  SettingsWalletSlotPlaceholder,
  SettingsWalletSlotSkeleton,
} from "./settings-wallet-slot";
import { SlotSeparator } from "./slot-separator";

const renderSettingRoutes = ({ item }: { item: AccountSettingItemProps }) => {
  return <AccountSettingItem {...item} />;
};

const renderEmail = ({ item }: { item: EmailSlotProps }) => {
  const email = item.email;
  const backendAddress = item.address;
  return <SettingsEmailSlot email={email} address={backendAddress} />;
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
  const isWeb = Platform.OS === "web";

  // TODO: Include wallets with `phone number flag` after backend implementation
  const emailWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_email
      ),
    [user?.data.profile.wallet_addresses_v2]
  );
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
  const wallets = user?.data.profile.wallet_addresses_excluding_email_v2;
  const keyExtractor = (wallet: WalletAddressesV2) => wallet.address;

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated]);

  return (
    <View tw="web:items-center h-[100vh] w-full">
      <Tabs.Root
        onIndexChange={setSelected}
        initialIndex={selected}
        tabListHeight={TAB_LIST_HEIGHT}
        lazy
      >
        <Tabs.Header>
          {Platform.OS === "ios" && <View tw={`h-[${headerHeight}px]`} />}
          <View tw="items-center bg-white dark:bg-black">
            <View tw="w-full max-w-screen-2xl flex-row justify-between py-4 px-4">
              <Text tw="text-2xl font-extrabold text-gray-900 dark:text-white">
                Settings
              </Text>
              {!isWeb ? (
                <Text tw="text-2xl font-extrabold text-gray-100 dark:text-gray-900">
                  v{Constants?.manifest?.version ?? packageJson?.version}
                </Text>
              ) : null}
            </View>
          </View>
        </Tabs.Header>
        <Tabs.List
          style={tw.style(
            `h-[${TAB_LIST_HEIGHT}px] dark:bg-black bg-white border-b border-b-gray-100 dark:border-b-gray-900 md:absolute md:-top-[${TAB_LIST_HEIGHT}px] right-0 xl:-right-24 2xl:-right-36 ios:w-screen android:w-screen`
          )}
        >
          <Tabs.Trigger>
            <TabItem name="Wallets" selected={selected === 0} />
          </Tabs.Trigger>
          <Tabs.Trigger>
            <TabItem name="Email Addresses" selected={selected === 1} />
          </Tabs.Trigger>
          <Tabs.Trigger>
            <TabItem name="Account" selected={selected === 2} />
          </Tabs.Trigger>
          <SelectedTabIndicator />
        </Tabs.List>
        <Tabs.Pager tw="mt-8">
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
            ListHeaderComponent={
              <SettingEmailSlotHeader
                hasEmail={Boolean(emailWallets?.length)}
              />
            }
            alwaysBounceVertical={false}
            ItemSeparatorComponent={() => <SlotSeparator />}
          />

          <Tabs.FlatList
            data={accountSettings}
            keyExtractor={(item) => item.id}
            renderItem={renderSettingRoutes}
            removeClippedSubviews={Platform.OS !== "web"}
            ListHeaderComponent={<SettingAccountSlotHeader />}
            ListFooterComponent={<SettingAccountSlotFooter />}
            alwaysBounceVertical={false}
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

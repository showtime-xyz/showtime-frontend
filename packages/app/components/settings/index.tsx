import { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { Platform, useWindowDimensions } from "react-native";

import Constants from "expo-constants";

import { Button } from "@showtime-xyz/universal.button";
import { Fieldset } from "@showtime-xyz/universal.fieldset";
import { ModalSheet } from "@showtime-xyz/universal.modal-sheet";
import { useRouter } from "@showtime-xyz/universal.router";
import { Switch } from "@showtime-xyz/universal.switch";
import {
  HeaderTabView,
  Route,
  SceneRendererProps,
  TabScrollView,
  TabFlatList,
  TabBarSingle,
} from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { MAX_CONTENT_WIDTH } from "app/constants/layout";
import { useAddWalletNickname } from "app/hooks/api/use-add-wallet-nickname";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { usePushNotificationsPreferences } from "app/hooks/use-push-notifications-preferences";
import { useTabState } from "app/hooks/use-tab-state";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { WalletAddressesV2 } from "app/types";

import { Hidden } from "design-system/hidden";
import { breakpoints } from "design-system/theme";

import packageJson from "../../../../package.json";
import {
  AccountSettingItem,
  SettingAccountSlotFooter,
  SettingAccountSlotHeader,
} from "./settings-account-slot";
import {
  SettingEmailSlotHeader,
  SettingsEmailSkeletonSlot,
  SettingsEmailSlot,
  SettingsEmailSlotPlaceholder,
} from "./settings-email-slot";
import {
  SettingPhoneNumberSlotHeader,
  SettingsPhoneNumberSkeletonSlot,
  SettingsPhoneNumberSlot,
  SettingsPhoneNumberSlotPlaceholder,
} from "./settings-phone-number-slot";
import {
  SettingsWalletSlot,
  SettingsWalletSlotHeader,
  SettingsWalletSlotPlaceholder,
  SettingsWalletSlotSkeleton,
} from "./settings-wallet-slot";
import { SlotSeparator } from "./slot-separator";

const SETTINGS_ROUTES = [
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
    title: "Account",
    key: "Account",
    index: 3,
  },
  {
    title: "Push Notifications",
    key: "Push Notifications",
    index: 4,
  },
];

const SettingsTabs = () => {
  const { width } = useWindowDimensions();

  const isMdWidth = width >= breakpoints["md"];

  const { user, isAuthenticated } = useUser();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const isWeb = Platform.OS === "web";
  const pushNotificationsPreferences = usePushNotificationsPreferences();
  const bottomHeight = usePlatformBottomHeight();
  const [editingWallet, setEditingWallet] = useState<
    WalletAddressesV2 | undefined
  >(undefined);

  const emailWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_email
      ),
    [user?.data.profile.wallet_addresses_v2]
  );

  const wallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => !wallet.is_email && !wallet.is_phone
      ),
    [user?.data.profile.wallet_addresses_v2]
  );

  const phoneNumberWallets = useMemo(
    () =>
      user?.data.profile.wallet_addresses_v2.filter(
        (wallet) => wallet.is_phone
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
  const keyExtractor = (wallet: WalletAddressesV2) => wallet.address;

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated, router]);

  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  const renderScene = useCallback(
    ({
      route: { index, key },
    }: SceneRendererProps & {
      route: Route;
    }) => {
      switch (key) {
        case "Wallets":
          return (
            <TabFlatList
              data={wallets as []}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => (
                <SettingsWalletSlot
                  onEditNickname={() => setEditingWallet(item)}
                  wallet={item}
                />
              )}
              ListEmptyComponent={() => {
                const hasNoWallet = Boolean(wallets);
                if (hasNoWallet) {
                  return <SettingsWalletSlotPlaceholder />;
                }
                return <SettingsWalletSlotSkeleton />;
              }}
              ListHeaderComponent={
                <SettingsWalletSlotHeader hasNoWallet={wallets?.length === 0} />
              }
              ItemSeparatorComponent={() =>
                isMdWidth ? <View tw="mt-2" /> : <SlotSeparator />
              }
              index={index}
            />
          );
        case "Email":
          return (
            <TabFlatList
              data={emailWallets}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => (
                <SettingsEmailSlot
                  email={item.email}
                  address={item.backendAddress}
                />
              )}
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
                  onAddEmail={() =>
                    router.push(
                      Platform.select({
                        native: `/settings/add-email`,
                        web: {
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            addEmailModal: true,
                          },
                        } as any,
                      }),
                      Platform.select({
                        native: `/settings/add-email`,
                        web: router.asPath,
                      }),
                      { scroll: false }
                    )
                  }
                />
              }
              ItemSeparatorComponent={() => <SlotSeparator />}
              index={index}
            />
          );
        case "Phone":
          return (
            <TabFlatList
              data={phoneNumberWallets}
              keyExtractor={keyExtractor}
              renderItem={({ item }) => (
                <SettingsPhoneNumberSlot
                  phoneNumber={item.phone_number}
                  address={item.backendAddress}
                />
              )}
              ListEmptyComponent={() => {
                const hasNoPhoneNumbers = Boolean(phoneNumberWallets);
                if (hasNoPhoneNumbers) {
                  return <SettingsPhoneNumberSlotPlaceholder />;
                }
                return <SettingsPhoneNumberSkeletonSlot />;
              }}
              ListHeaderComponent={
                <SettingPhoneNumberSlotHeader
                  hasPhoneNumber={Boolean(phoneNumberWallets?.length)}
                  onVerifyPhoneNumber={() =>
                    router.push(
                      Platform.select({
                        native: `/settings/verify-phone-number`,
                        web: {
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            verifyPhoneNumberModal: true,
                          },
                        } as any,
                      }),
                      Platform.select({
                        native: `/settings/verify-phone-number`,
                        web: router.asPath,
                      }),
                      { scroll: false }
                    )
                  }
                />
              }
              ItemSeparatorComponent={() => <SlotSeparator />}
              index={index}
            />
          );
        case "Account":
          return (
            <TabScrollView index={index}>
              <SettingAccountSlotHeader />
              {accountSettings?.length > 0 &&
                accountSettings.map((item) => (
                  <AccountSettingItem {...item} key={item.id} />
                ))}
              <SettingAccountSlotFooter />
            </TabScrollView>
          );
        case "Push Notifications":
          return (
            <TabScrollView index={index}>
              {Object.entries(pushNotificationsPreferences?.data)?.length > 0 &&
                Object.entries(pushNotificationsPreferences?.data).map(
                  (item, index) => {
                    const [key, value] = item;
                    if (key === "created_at" || key === "updated_at") {
                      return null;
                    }
                    return (
                      <View key={index.toString()}>
                        <View tw="flex-row items-center justify-between p-4">
                          <Text tw="flex-1 text-sm text-gray-900 dark:text-white">
                            {key.toUpperCase().replace(/_/g, " ")}
                          </Text>
                          <View tw="w-2" />
                          <Switch
                            checked={value as boolean}
                            onChange={async () => {
                              await axios({
                                url: "/v1/notifications/preferences/push",
                                method: "PATCH",
                                data: {
                                  [key]: !value,
                                },
                              });
                              pushNotificationsPreferences?.refresh();
                            }}
                          />
                        </View>
                        {index <
                          Object.entries(pushNotificationsPreferences?.data)
                            ?.length -
                            1 && <SlotSeparator />}
                      </View>
                    );
                  }
                )}
            </TabScrollView>
          );
        default:
          return null;
      }
    },
    [
      wallets,
      emailWallets,
      phoneNumberWallets,
      accountSettings,
      pushNotificationsPreferences,
      isMdWidth,
      router,
    ]
  );

  const renderHeader = useCallback(() => {
    return (
      <>
        {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
        <View tw="dark:shadow-dark shadow-light items-center bg-white dark:bg-black md:mb-4">
          <View tw="w-full max-w-screen-2xl flex-row justify-between self-center px-4 py-4 md:py-0">
            <Text tw="font-space-bold self-center text-2xl font-extrabold text-gray-900 dark:text-white">
              Settings
            </Text>
            {!isWeb ? (
              <Text tw="font-space-bold text-2xl font-extrabold text-gray-100 dark:text-gray-900">
                v{Constants?.manifest?.version ?? packageJson?.version}
              </Text>
            ) : (
              <Hidden until="md">
                <TabBarSingle
                  onPress={(i) => {
                    setIndex(i);
                  }}
                  routes={SETTINGS_ROUTES}
                  index={index}
                />
              </Hidden>
            )}
          </View>
        </View>
      </>
    );
  }, [headerHeight, index, isWeb, setIndex]);

  return (
    <View style={{ width }} tw="flex-1">
      <HeaderTabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderScrollHeader={renderHeader}
        minHeaderHeight={Platform.select({
          default: headerHeight,
          android: 0,
        })}
        sceneContainerStyle={{
          maxWidth: MAX_CONTENT_WIDTH,
          alignSelf: Platform.OS === "web" ? "center" : undefined,
        }}
        autoWidthTabBar
        hideTabBar={isMdWidth}
        swipeEnabled={!isMdWidth}
        initialLayout={{
          width: width,
        }}
        style={{ zIndex: 1 }}
      />
      <View style={{ height: bottomHeight }} />
      <EditNicknameModal
        editingWallet={editingWallet}
        onClose={() => setEditingWallet(undefined)}
      />
    </View>
  );
};

const EditNicknameModal = ({
  editingWallet,
  onClose,
}: {
  editingWallet?: WalletAddressesV2;
  onClose: any;
}) => {
  const [nickname, setNickname] = useState("");
  const { editWalletNickName } = useAddWalletNickname();
  const initialValueSet = useRef(false);

  useEffect(() => {
    if (editingWallet?.nickname && !initialValueSet.current) {
      setNickname(editingWallet?.nickname);
      initialValueSet.current = true;
    }
  }, [editingWallet?.nickname]);

  return (
    <ModalSheet
      title="Edit Nickname"
      visible={!!editingWallet}
      close={onClose}
      onClose={onClose}
    >
      <View tw="p-4">
        <Fieldset
          placeholder="rainbow wallet"
          label="Nickname"
          autoFocus
          value={nickname}
          onChangeText={setNickname}
        />
        <Button
          tw="mt-4"
          onPress={() => {
            if (editingWallet) {
              editWalletNickName(editingWallet?.address, nickname);
              onClose();
            }
          }}
        >
          Submit
        </Button>
      </View>
    </ModalSheet>
  );
};

export function Settings() {
  return (
    <ErrorBoundary>
      <SettingsTabs />
    </ErrorBoundary>
  );
}

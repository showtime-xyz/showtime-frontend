import { useEffect, useMemo, useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import Constants from "expo-constants";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { Switch } from "@showtime-xyz/universal.switch";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { usePushNotificationsPreferences } from "app/hooks/use-push-notifications-preferences";
import { useTabState } from "app/hooks/use-tab-state";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { WalletAddressesV2 } from "app/types";

import { Hidden } from "design-system/hidden";
import {
  HeaderTabView,
  Route,
  SceneRendererProps,
  TabScrollView,
  TabFlatList,
} from "design-system/tab-view";
import { TabBarSingle } from "design-system/tab-view/tab-bar-single";
import {
  breakpoints,
  CARD_DARK_SHADOW,
  CARD_LIGHT_SHADOW,
} from "design-system/theme";

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
    title: "Account",
    key: "Account",
    index: 2,
  },
  {
    title: "Push Notifications",
    key: "Push Notifications",
    index: 3,
  },
];

const SettingsTabs = () => {
  const { width } = useWindowDimensions();

  const isMdWidth = width >= breakpoints["md"];

  const { user, isAuthenticated } = useUser();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const isDark = useIsDarkMode();
  const isWeb = Platform.OS === "web";
  const pushNotificationsPreferences = usePushNotificationsPreferences();
  const bottomHeight = usePlatformBottomHeight();
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
                  address={item.address}
                  ensDomain={item.ens_domain}
                  mintingEnabled={item.minting_enabled}
                />
              )}
              ListEmptyComponent={() => {
                const hasNoWallet = Boolean(wallets);
                if (hasNoWallet) {
                  return <SettingsWalletSlotPlaceholder />;
                }
                return <SettingsWalletSlotSkeleton />;
              }}
              ListHeaderComponent={<SettingsWalletSlotHeader />}
              ItemSeparatorComponent={() => <SlotSeparator />}
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
      accountSettings,
      emailWallets,
      router,
      wallets,
      pushNotificationsPreferences,
    ]
  );

  const renderHeader = useCallback(() => {
    return (
      <>
        {Platform.OS === "ios" && <View style={{ height: headerHeight }} />}
        <View
          tw="items-center bg-white dark:bg-black md:mb-4"
          style={{
            // @ts-ignore
            boxShadow: isDark ? CARD_DARK_SHADOW : CARD_LIGHT_SHADOW,
          }}
        >
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
  }, [headerHeight, index, isDark, isWeb, setIndex]);

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
        sceneContainerStyle={tw.style("max-w-screen-xl web:self-center")}
        autoWidthTabBar
        hideTabBar={isMdWidth}
        swipeEnabled={!isMdWidth}
        initialLayout={{
          width: width,
        }}
        style={tw.style("z-1")}
      />
      <View style={{ height: bottomHeight }} />
    </View>
  );
};

export function Settings() {
  return (
    <ErrorBoundary>
      <SettingsTabs />
    </ErrorBoundary>
  );
}

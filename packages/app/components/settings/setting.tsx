import { useEffect, useCallback, useState } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import {
  HeaderTabView,
  Route,
  SceneRendererProps,
} from "@showtime-xyz/universal.tab-view";

import { ErrorBoundary } from "app/components/error-boundary";
import { useTabState } from "app/hooks/use-tab-state";
import { useUser } from "app/hooks/use-user";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { WalletAddressesV2 } from "app/types";

import { EditNicknameModal } from "./setting-edit-nickname-moda";
import { SettingsHeader } from "./setting-header";
import { SettingTabsScene, SETTINGS_ROUTES } from "./tabs";

const SettingsTabs = () => {
  const { isAuthenticated } = useUser();
  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [editingWallet, setEditingWallet] = useState<
    WalletAddressesV2 | undefined
  >(undefined);

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated, router]);

  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return (
        <SettingTabsScene route={route} setEditingWallet={setEditingWallet} />
      );
    },
    []
  );

  const renderHeader = useCallback(() => {
    return (
      <SettingsHeader
        index={index}
        setIndex={setIndex}
        routers={SETTINGS_ROUTES}
      />
    );
  }, [index, setIndex]);

  return (
    <>
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
          paddingBottom: Math.max(bottom, 20),
        }}
        autoWidthTabBar
      />
      {editingWallet ? (
        <EditNicknameModal
          editingWallet={editingWallet}
          onClose={() => setEditingWallet(undefined)}
        />
      ) : null}
    </>
  );
};

export function Settings() {
  return (
    <ErrorBoundary>
      <SettingsTabs />
    </ErrorBoundary>
  );
}

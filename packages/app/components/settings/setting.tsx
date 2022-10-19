import { useEffect, useCallback, useState } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import {
  HeaderTabView,
  Route,
  SceneRendererProps,
} from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useTabState } from "app/hooks/use-tab-state";
import { useUser } from "app/hooks/use-user";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { WalletAddressesV2 } from "app/types";

import { SETTINGS_ROUTES } from ".";
import { EditNicknameModal } from "./setting-edit-nickname-moda";
import { SettingsHeader } from "./setting-header";
import { SettingTabsScene } from "./tabs";

const SettingsTabs = () => {
  const { isAuthenticated } = useUser();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const bottomHeight = usePlatformBottomHeight();
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
        autoWidthTabBar
      />
      <View style={{ height: bottomHeight }} />
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

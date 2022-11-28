import { useState } from "react";

import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useTabState } from "app/hooks/use-tab-state";
import { WalletAddressesV2 } from "app/types";

import { EditNicknameModal } from "./setting-edit-nickname-moda";
import { SettingsHeader } from "./setting-header";
import { SettingTabsScene, SETTINGS_ROUTES } from "./tabs";

const SettingsTabs = () => {
  const bottomHeight = usePlatformBottomHeight();
  const [editingWallet, setEditingWallet] = useState<
    WalletAddressesV2 | undefined
  >(undefined);

  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  return (
    <View tw="min-h-screen w-full">
      <SettingsHeader
        index={index}
        setIndex={setIndex}
        routers={SETTINGS_ROUTES}
      />
      <View tw="mx-auto h-full w-full max-w-screen-xl">
        <SettingTabsScene
          route={routes[index]}
          setEditingWallet={setEditingWallet}
        />
      </View>
      <View style={{ height: bottomHeight }} />
      {editingWallet ? (
        <EditNicknameModal
          editingWallet={editingWallet}
          onClose={() => setEditingWallet(undefined)}
        />
      ) : null}
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

import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useTabState } from "app/hooks/use-tab-state";
import { WalletAddressesV2 } from "app/types";

import { breakpoints } from "design-system/theme";

import { EditNicknameModal } from "./setting-edit-nickname-moda";
import { SettingsHeader } from "./setting-header";
import { SettingsMd } from "./setting.md";
import { SettingTabsScene, SETTINGS_ROUTES } from "./tabs";

const SettingsTabs = () => {
  const bottomHeight = usePlatformBottomHeight();
  const [editingWallet, setEditingWallet] = useState<
    WalletAddressesV2 | undefined
  >(undefined);
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  return isMdWidth ? (
    <SettingsMd />
  ) : (
    <View tw="h-screen w-full overflow-auto bg-white dark:bg-black">
      <SettingsHeader
        index={index}
        setIndex={setIndex}
        routers={SETTINGS_ROUTES}
      />
      <SettingTabsScene
        route={routes[index]}
        setEditingWallet={setEditingWallet}
      />
      <View style={{ height: bottomHeight }} />
      {editingWallet ? (
        <EditNicknameModal
          editingWallet={editingWallet}
          onClose={() => setEditingWallet(undefined)}
        />
      ) : null}
      <View />
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

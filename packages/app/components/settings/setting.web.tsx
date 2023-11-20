import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { View } from "@showtime-xyz/universal.view";

import { ErrorBoundary } from "app/components/error-boundary";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useTabState } from "app/hooks/use-tab-state";
import { WalletAddressesV2 } from "app/types";

import { breakpoints } from "design-system/theme";

import { useUser } from "../../hooks/use-user";
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
  const { isAuthenticated } = useUser();
  const isLgWidth = width >= breakpoints["lg"];
  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  if (!isAuthenticated) {
    return (
      <View tw="flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }
  return isLgWidth ? (
    <SettingsMd />
  ) : (
    <View tw="h-screen w-full border-l-0 border-gray-200 bg-white dark:border-gray-800 dark:bg-black md:border-l">
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

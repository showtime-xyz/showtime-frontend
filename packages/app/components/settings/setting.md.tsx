import { useState, useEffect } from "react";
import { Platform } from "react-native";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useTabState } from "app/hooks/use-tab-state";
import { Sticky } from "app/lib/stickynode";
import { WalletAddressesV2 } from "app/types";

import { TabBarVertical } from "design-system/tab-view";

import { EditNicknameModal } from "./setting-edit-nickname-moda";
import { SettingTabsScene, SETTINGS_ROUTES } from "./tabs";

const LEFT_SLIDE_WIDTH = 264;
export const SettingsMd = () => {
  const bottomHeight = usePlatformBottomHeight();
  const contentWidth = useContentWidth();
  const [editingWallet, setEditingWallet] = useState<
    WalletAddressesV2 | undefined
  >(undefined);
  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  useEffect(() => {
    if (Platform.OS === "web") {
      window.scrollTo(0, 0);
    }
  }, [index]);

  return (
    <View tw="h-screen w-full flex-1 bg-white dark:bg-black">
      <View tw="h-screen w-full flex-row">
        <View tw="w-72 border-l border-r border-neutral-300 dark:border-neutral-700">
          <View tw="bg-white pt-8 dark:bg-black">
            <Text tw="px-4 text-xl font-bold text-gray-900 dark:text-white">
              Settings
            </Text>
            <TabBarVertical
              onPress={(i) => {
                setIndex(i);
              }}
              routes={routes}
              index={index}
              tw="px-2"
            />
          </View>
        </View>

        <View tw="w-full flex-1 overflow-hidden overflow-y-auto rounded-2xl bg-white px-6 pb-2 pt-5 dark:bg-black">
          <View>
            <SettingTabsScene
              route={routes[index]}
              setEditingWallet={setEditingWallet}
            />
          </View>
        </View>
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

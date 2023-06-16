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
const LEFT_SLIDE_MARGIN = 16;
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
    <View tw="w-full max-w-screen-xl flex-1 px-4 pb-8">
      <View tw="flex-row">
        <View
          style={{
            width: LEFT_SLIDE_WIDTH,
            marginRight: LEFT_SLIDE_MARGIN,
          }}
        >
          <Sticky top={48} enabled>
            <View>
              <Text tw="text-2xl font-bold text-black dark:text-white">
                Settings
              </Text>
              <TabBarVertical
                onPress={(i) => {
                  setIndex(i);
                }}
                routes={routes}
                index={index}
              />
            </View>
          </Sticky>
        </View>

        <View
          tw="mt-12 flex-1 rounded-2xl bg-white p-8 dark:bg-black"
          style={{
            maxWidth: contentWidth - LEFT_SLIDE_WIDTH - LEFT_SLIDE_MARGIN,
          }}
        >
          <SettingTabsScene
            route={routes[index]}
            setEditingWallet={setEditingWallet}
          />
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

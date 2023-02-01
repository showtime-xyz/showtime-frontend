import { useState } from "react";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ChevronRight } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useContentWidth } from "app/hooks/use-content-width";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useTabState } from "app/hooks/use-tab-state";
import { Sticky } from "app/lib/stickynode";
import { WalletAddressesV2 } from "app/types";

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
  const isDark = useIsDarkMode();
  const { index, setIndex, routes } = useTabState(SETTINGS_ROUTES);

  return (
    <View tw="w-full max-w-screen-xl flex-1 px-4 pb-8 pt-28">
      <View tw="flex-row">
        <View
          style={{
            width: LEFT_SLIDE_WIDTH,
            marginRight: LEFT_SLIDE_MARGIN,
          }}
        >
          <Sticky top={112} enabled>
            <View>
              <Text tw="font-space-bold text-2xl text-black dark:text-white">
                Settings
              </Text>
              <View tw="dark:shadow-dark mt-8 rounded-2xl bg-white dark:bg-black">
                {routes.map((item, tabbarIndex) => (
                  <Pressable
                    tw="flex-row items-center justify-between rounded-2xl px-4 py-4 duration-300 hover:bg-gray-50 hover:dark:bg-gray-900"
                    key={item.key}
                    onPress={() => setIndex(tabbarIndex)}
                  >
                    <Text
                      tw={[
                        "text-lg font-medium leading-6 text-black duration-300 dark:text-white",
                        tabbarIndex === index ? "font-bold" : "",
                      ]}
                    >
                      {item.title}
                    </Text>
                    <View
                      tw={[
                        "duration-200",
                        tabbarIndex === index ? "opacity-100" : "opacity-0",
                      ]}
                    >
                      <ChevronRight
                        width={24}
                        height={24}
                        color={isDark ? colors.white : colors.black}
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </Sticky>
        </View>

        <View
          tw="dark:shadow-dark mt-12 flex-1 rounded-2xl bg-white p-8 dark:bg-black"
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

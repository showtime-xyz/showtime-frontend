import { useMemo } from "react";
import { Platform, ScrollView } from "react-native";

import { TabScrollView } from "@showtime-xyz/universal.collapsible-tab-view";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Spotify } from "@showtime-xyz/universal.icon";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useConnectSpotify } from "app/hooks/use-connect-spotify";
import { useDisconnectSpotify } from "app/hooks/use-disconnect-spotify";
import { useUser } from "app/hooks/use-user";

import {
  AccountSettingItem,
  SettingAccountSlotFooter,
  SettingAccountSlotHeader,
} from "../settings-account-slot";

const SettingScrollComponent =
  Platform.OS === "web" ? ScrollView : TabScrollView;

export type AccountTabProps = {
  index?: number;
};

export const AccountTab = ({ index = 0 }: AccountTabProps) => {
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

  const user = useUser();

  const { disconnectSpotify } = useDisconnectSpotify();
  const { connectSpotify } = useConnectSpotify();
  const isDark = useIsDarkMode();

  return (
    <SettingScrollComponent index={index}>
      <SettingAccountSlotHeader />
      {accountSettings?.length > 0 &&
        accountSettings.map((item) => (
          <AccountSettingItem {...item} key={item.id} />
        ))}
      <View tw="space-between mb-4 flex-row items-center justify-between px-4">
        <View tw="flex-row items-center">
          <Spotify height={32} width={32} color={isDark ? "#fff" : "#000"} />
          <Text tw="text-md mx-2 font-bold text-gray-900 dark:text-gray-100">
            Spotify Connected
          </Text>
        </View>
        <Switch
          checked={user.user?.data.profile.has_spotify_token}
          onChange={() => {
            if (user.user?.data.profile.has_spotify_token) {
              disconnectSpotify();
            } else {
              connectSpotify("/settings?tab=" + index);
            }
          }}
        />
      </View>
      <SettingAccountSlotFooter />
    </SettingScrollComponent>
  );
};

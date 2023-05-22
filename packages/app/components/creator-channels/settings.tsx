import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { useCustomAlert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Divider } from "@showtime-xyz/universal.divider";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { createParam } from "app/navigation/use-param";

type Query = {
  channelId: string;
};
const { useParam } = createParam<Query>();

export const ChannelsSettings = () => {
  const [channelId] = useParam("channelId");
  const [showSettings, setShowSettings] = useState(false);
  const [checked, setChecked] = useState(false);
  const CustomAlert = useCustomAlert();
  const insets = useSafeAreaInsets();
  const bototm = usePlatformBottomHeight();
  return (
    <BottomSheetModalProvider>
      <Divider />
      <View tw="px-4 pb-6 pt-4">
        <Text tw="text-sm font-bold text-black dark:text-white">
          Notifications
        </Text>
        <View tw="mt-4 flex-row items-center justify-between">
          <Text tw="text-sm text-black dark:text-white">Creator Updates</Text>
          <Switch size="small" checked={checked} onChange={setChecked} />
        </View>
        <Divider tw="my-4" />
        <Text tw="text-sm font-bold text-black dark:text-white">
          Leave channel
        </Text>
        <View tw="mt-3 flex-row items-center justify-between">
          <Text tw="text-sm text-black dark:text-white">Leave channel</Text>
          <View>
            <Button
              variant="danger"
              onPress={() => {
                CustomAlert.alert(
                  `Leave Channel`,
                  "Are you sure you want to leave this Channel?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Leave",
                      style: "destructive",
                      onPress: async () => {
                        console.log("Leave Channel");
                      },
                    },
                  ]
                );
              }}
            >
              Leave Channel
            </Button>
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

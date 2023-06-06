import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { Alert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Divider } from "@showtime-xyz/universal.divider";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { createParam } from "app/navigation/use-param";

import { useLeaveChannel } from "./hooks/use-leave-channel";

type Query = {
  channelId: number;
};
const { useParam } = createParam<Query>();

export const ChannelsSettings = () => {
  const [channelId] = useParam("channelId", {
    parse: (value) => Number(value),
    initial: undefined,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [checked, setChecked] = useState(false);
  const insets = useSafeAreaInsets();
  const bototm = usePlatformBottomHeight();
  const leaveChannel = useLeaveChannel();
  const router = useRouter();
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
                Alert.alert(
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
                        if (typeof channelId !== "undefined") {
                          await leaveChannel.trigger({ channelId });
                          router.replace("/channels");
                        }
                      },
                    },
                  ]
                );
              }}
              disabled={leaveChannel.isMutating}
            >
              {leaveChannel.isMutating ? "Leaving..." : "Leave channel"}
            </Button>
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

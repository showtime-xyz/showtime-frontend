import { Alert } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { Button } from "@showtime-xyz/universal.button";
import { Divider } from "@showtime-xyz/universal.divider";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Switch } from "@showtime-xyz/universal.switch";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { createParam } from "app/navigation/use-param";

import {
  useChannelSettings,
  useEditChannelSettings,
} from "./hooks/use-edit-channel-settings";
import { useLeaveChannel } from "./hooks/use-leave-channel";

type Query = {
  channelId: string;
};
const { useParam } = createParam<Query>();

export const ChannelsSettings = () => {
  const [channelId] = useParam("channelId");
  const { data, isLoading } = useChannelSettings(channelId);
  const { trigger } = useEditChannelSettings(channelId);
  const leaveChannel = useLeaveChannel();
  const router = useRouter();

  const changeSettings = async (checked: boolean) => {
    if (!channelId) return;
    trigger({ muted: !checked, channelId });
  };

  return (
    <BottomSheetModalProvider>
      <Divider />
      <View tw="px-4 pb-6 pt-4">
        <Text tw="text-sm font-bold text-black dark:text-white">
          Notifications
        </Text>
        <View tw="mt-4 flex-row items-center justify-between">
          <Text tw="text-sm text-black dark:text-white">Creator updates</Text>
          {isLoading ? (
            <Spinner size="small" />
          ) : (
            <Switch
              size="small"
              checked={!data?.muted}
              onChange={changeSettings}
            />
          )}
        </View>
        <Divider tw="my-4" />
        <View tw="flex-row items-center justify-between">
          <Text tw="text-sm font-bold text-black dark:text-white">
            Leave channel
          </Text>
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
              {leaveChannel.isMutating ? "Leaving..." : "Leave"}
            </Button>
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

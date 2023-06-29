import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import {
  useJoinedChannelsList,
  useSuggestedChannelsList,
} from "./use-channels-list";

async function leaveChannel(
  url: string,
  { arg }: { arg: { channelId: string } }
) {
  return axios({
    url: `/v1/channels/${arg.channelId}/leave`,
    method: "POST",
  });
}

export const useLeaveChannel = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels/leave`,
    leaveChannel
  );
  const joinedChannels = useJoinedChannelsList();
  const suggestedChannels = useSuggestedChannelsList();

  const handleSubmit = async ({ channelId }: { channelId: string }) => {
    try {
      await trigger({ channelId });
    } catch (e) {
      captureException(e);
      Logger.error(e);
    } finally {
      joinedChannels.mutate();
      suggestedChannels.mutate();
    }
  };

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

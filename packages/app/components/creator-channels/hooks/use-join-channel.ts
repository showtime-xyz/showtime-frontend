import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import {
  useJoinedChannelsList,
  useSuggestedChannelsList,
} from "./use-channels-list";

async function joinChannel(
  url: string,
  { arg }: { arg: { channelId: number } }
) {
  return axios({
    url: `/v1/channels/${arg.channelId}/join`,
    method: "POST",
  });
}

export const useJoinChannel = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels/join`,
    joinChannel
  );
  const joinedChannels = useJoinedChannelsList();
  const suggestedChannels = useSuggestedChannelsList();

  const handleSubmit = async ({ channelId }: { channelId: number }) => {
    try {
      await trigger({ channelId });
    } catch (e) {
      captureException(e);
      Logger.error(e);
    } finally {
      suggestedChannels.mutate();
      joinedChannels.mutate();
    }
  };

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

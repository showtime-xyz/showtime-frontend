import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { useChannelMessages } from "./use-channel-messages";
import { useOwnedChannelsList } from "./use-channels-list";

async function deleteMessage(
  url: string,
  { arg }: { arg: { messageId: number } }
) {
  return axios({
    url: `/v1/channels/message/${arg.messageId}/delete`,
    method: "DELETE",
  });
}

export const useDeleteMessage = (channelId?: string) => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/v1/channels/message/{message_id}/delete`,
    deleteMessage
  );
  const channelMessages = useChannelMessages(channelId);
  const joinedChannelsList = useOwnedChannelsList();

  const handleSubmit = async ({ messageId }: { messageId: number }) => {
    channelMessages.mutate(
      (d) => {
        if (d) {
          d.forEach(
            (m, index) =>
              (d[index] = d[index].filter(
                (message) => message.channel_message.id !== messageId
              ))
          );
          return [...d];
        }
      },
      { revalidate: false }
    );

    try {
      await trigger({ messageId });
    } catch (e) {
      captureException(e);
      Logger.error(e);
    } finally {
      channelMessages.mutate();
      joinedChannelsList.refresh();
    }
  };

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

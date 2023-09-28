import useSWRMutation from "swr/mutation";

import { useStableCallback } from "app/hooks/use-stable-callback";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { useChannelMessages } from "./use-channel-messages";
import { useOwnedChannelsList } from "./use-channels-list";

async function postMessage(
  url: string,
  { arg }: { arg: { channelId: string; messageId: number; message: string } }
) {
  return axios({
    url: `/v1/channels/message/${arg.messageId}/edit`,
    method: "POST",
    data: {
      body: arg.message,
    },
  });
}

export const useEditChannelMessage = (channelId?: string) => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels//messages/{message_id}/send`,
    postMessage
  );
  const channelMessages = useChannelMessages(channelId);
  const joinedChannelsList = useOwnedChannelsList();

  const handleSubmit = useStableCallback(
    async ({
      messageId,
      channelId,
      message,
    }: {
      channelId: string;
      messageId: number;
      message: string;
    }) => {
      try {
        channelMessages.mutate(
          (d) => {
            if (d) {
              d[0] = d[0].map((v) => {
                if (v.channel_message.id === messageId) {
                  return {
                    ...v,
                    channel_message: {
                      ...v.channel_message,
                      body: message,
                    },
                  };
                }
                return v;
              });

              return [...d];
            }
            return d;
          },
          {
            revalidate: false,
          }
        );
        await trigger({ message, channelId, messageId });
      } catch (e) {
        captureException(e);
        Logger.error(e);
      } finally {
        channelMessages.mutate();
        joinedChannelsList.refresh();
      }
    }
  );

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

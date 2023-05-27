import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { useChannelMessages } from "./use-channel-messages";

async function postMessageReaction(
  url: string,
  { arg }: { arg: { messageId: number; reactionId: number } }
) {
  return axios({
    url: `/v1/channels/message/${arg.messageId}/react/${arg.reactionId}`,
    method: "POST",
  });
}

export const useReactOnMessage = (channelId: string) => {
  const mutateState = useSWRMutation(
    "/v1/channels/message/${message_id}/react/${reaction_id}",
    postMessageReaction
  );
  const channelMessages = useChannelMessages(channelId);

  const handleSubmit = async ({
    messageId,
    reactionId,
  }: {
    messageId: number;
    reactionId: number;
  }) => {
    channelMessages.mutate(
      (d) => {
        if (d) {
          d.forEach((c) => {
            c.forEach((m) => {
              if (m.channel_message.id === messageId) {
                if (m.reaction_group.length > 0) {
                  const index = m.reaction_group.findIndex(
                    (r) => r.reaction_id === reactionId
                  );

                  if (index === -1) {
                    m.reaction_group.push({
                      reaction_id: reactionId,
                      count: 1,
                      self_reacted: true,
                    });
                  } else {
                    // Toggle if reacted by me
                    if (m.reaction_group[index].self_reacted) {
                      if (m.reaction_group[index].count === 1) {
                        m.reaction_group = m.reaction_group.filter((f) => {
                          return f.reaction_id !== reactionId;
                        });
                      } else {
                        m.reaction_group[index].count -= 1;
                        m.reaction_group[index].self_reacted = false;
                      }
                    } else {
                      m.reaction_group[index].count += 1;
                      m.reaction_group[index].self_reacted = true;
                    }
                  }
                } else {
                  m.reaction_group.push({
                    reaction_id: reactionId,
                    count: 1,
                    self_reacted: true,
                  });
                }
              }
            });
          });
          return [...d];
        }
      },
      { revalidate: false }
    );

    try {
      await mutateState.trigger({
        reactionId,
        messageId,
      });
    } catch (e) {
      captureException(e);
      Logger.error(e);
    } finally {
      channelMessages.mutate();
    }
  };

  return { ...mutateState, trigger: handleSubmit };
};

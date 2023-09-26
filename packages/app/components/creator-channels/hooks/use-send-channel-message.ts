import { useContext } from "react";

import useSWRMutation from "swr/mutation";

import { UserContext } from "app/context/user-context";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { useChannelMessages } from "./use-channel-messages";
import { useOwnedChannelsList } from "./use-channels-list";

async function postMessage(
  url: string,
  { arg }: { arg: { channelId: string; message: string } }
) {
  return axios({
    url,
    method: "POST",
    data: {
      body: arg.message,
    },
  });
}

export const useSendChannelMessage = (
  channelId?: string,
  isAdmin?: boolean
) => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels/${channelId}/messages/send`,
    postMessage
  );
  const channelMessages = useChannelMessages(channelId);
  const joinedChannelsList = useOwnedChannelsList();

  const user = useContext(UserContext);
  const handleSubmit = async ({
    message,
    channelId,
    callback,
  }: {
    channelId: string;
    message: string;
    callback?: () => void;
  }) => {
    const optimisticObjectId = Math.random() + new Date().getTime();
    channelMessages.mutate(
      (d) => {
        if (user?.user && d) {
          const optimisticObject = {
            channel_message: {
              body: message,
              body_text_length: message.length,
              id: optimisticObjectId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              sent_by: {
                admin: isAdmin || false,
                created_at: new Date().toISOString(),
                id: user.user.data.profile.profile_id,
                profile: user.user?.data.profile,
              },
              attachments: [],
            },
            reaction_group: [],
          };

          if (d.length === 0) {
            return [[optimisticObject]];
          } else {
            d[0] = [optimisticObject, ...d[0]];
            return [...d];
          }
        }
        return d;
      },
      {
        revalidate: false,
      }
    );

    try {
      const res = await trigger({ message, channelId });
      channelMessages.mutate(
        (d) => {
          if (d) {
            d[0] = d[0].map((v) => {
              if (v.channel_message.id === optimisticObjectId) {
                return {
                  channel_message: res,
                  reaction_group: [],
                };
              }
              return v;
            });

            return [...d];
          }
          return d;
        },
        {
          revalidate: true,
        }
      );
    } catch (e) {
      captureException(e);
      Logger.error(e);
    } finally {
      joinedChannelsList.refresh();
    }

    callback?.();
  };

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

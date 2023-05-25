import useSWRMutation from "swr/mutation";

import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";

import { useChannelMessages } from "./use-channel-messages";

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

export const useSendChannelMessage = (channelId?: string) => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels/${channelId}/messages/send`,
    postMessage
  );
  const channelMessages = useChannelMessages(channelId);

  const user = useUser();
  const handleSubmit = async ({
    message,
    channelId,
    callback,
  }: {
    channelId: string;
    message: string;
    callback?: () => void;
  }) => {
    const optimisticObjectId = Math.random();
    channelMessages.mutate(
      (d) => {
        if (user.user && d) {
          const optimisticObject = {
            channel_message: {
              body: message,
              id: optimisticObjectId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              sent_by: {
                admin: true,
                created_at: new Date().toISOString(),
                id: user.user.data.profile.profile_id,
                profile: user.user?.data.profile,
              },
            },
            reaction_group: [],
          };

          if (d.length === 0) {
            return [[optimisticObject]];
          } else {
            d[0].unshift(optimisticObject);
            return [...d];
          }
        }
        return d;
      },
      {
        revalidate: false,
      }
    );

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
    callback?.();
  };

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

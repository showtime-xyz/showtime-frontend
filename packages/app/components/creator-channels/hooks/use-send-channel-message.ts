import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

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

  return {
    trigger,
    isMutating,
    error,
  };
};

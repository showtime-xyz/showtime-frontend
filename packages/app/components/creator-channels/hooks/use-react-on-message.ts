import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

async function postMessageReaction(
  url: string,
  { arg }: { arg: { messageId: number; reactionId: number } }
) {
  return axios({
    url: `/v1/channels/message/${arg.messageId}/react/${arg.reactionId}`,
    method: "POST",
  });
}

export const useReactOnMessage = () => {
  const mutateState = useSWRMutation(
    "/v1/channels/message/${message_id}/react/${reaction_id}",
    postMessageReaction
  );

  return mutateState;
};

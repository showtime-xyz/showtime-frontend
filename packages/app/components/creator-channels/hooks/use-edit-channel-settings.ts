import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

async function editSettings(
  url: string,
  { arg }: { arg: { channelId: string; muted: boolean } }
) {
  return axios({
    url: `/v1/channels/member/${arg.channelId}/settings/edit`,
    method: "POST",
    data: { muted: arg.muted },
  });
}

export const useEditChannelSettings = (channelId?: string) => {
  const { trigger, isMutating, error } = useSWRMutation(
    `/v1/channels/member/${channelId}/settings/edit`,
    editSettings
  );

  const handleSubmit = async ({
    muted,
    channelId,
  }: {
    channelId: string;
    muted: boolean;
  }) => {
    try {
      await trigger({ muted, channelId });
    } catch (e) {
      captureException(e);
      Logger.error(e);
    }
  };

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

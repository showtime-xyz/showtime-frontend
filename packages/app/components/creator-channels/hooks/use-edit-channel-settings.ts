import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcher } from "app/hooks/use-infinite-list-query";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { ChannelSetting } from "../types";

export const useChannelSettings = (channelId?: string) => {
  const queryState = useSWR<ChannelSetting>(
    channelId ? `/v1/channels/member/${channelId}/settings` : null,
    fetcher
  );

  return {
    ...queryState,
  };
};

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
    `/v1/channels/member/${channelId}/settings`,
    editSettings
  );

  const handleSubmit = useStableCallback(
    async ({ muted, channelId }: { channelId: string; muted: boolean }) => {
      try {
        await trigger(
          { muted, channelId },
          { optimisticData: (current) => ({ ...current, muted }) }
        );
      } catch (e) {
        captureException(e);
        Logger.error(e);
      }
    }
  );

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};

import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";

import { toast } from "design-system/toast";

type Report = {
  userId?: number | string;
  nftId?: number | string;
  activityId?: number;
  description?: string;
  channelMessageId?: number;
};

function useReport() {
  const { mutate } = useSWRConfig();

  const report = useCallback(
    async ({
      userId,
      nftId,
      activityId,
      channelMessageId,
      description = "", // TODO: implement a modal to report with a description
    }: Report) => {
      await axios({
        url: `/v2/reportitem`,
        method: "POST",
        data: {
          nft_id: nftId,
          description,
          activity_id: activityId,
          profile_id: userId,
          channel_message_id: channelMessageId,
        },
      });
      mutate(null);
      toast("Reported!");
    },
    [mutate]
  );

  return {
    report,
  };
}

export { useReport };

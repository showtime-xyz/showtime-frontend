import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { useToast } from "@showtime-xyz/universal.toast";

import { axios } from "app/lib/axios";

type Report = {
  userId?: number | string;
  nftId?: number | string;
  activityId?: number;
  description?: string;
};

function useReport() {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  const report = useCallback(
    async ({
      userId,
      nftId,
      activityId,
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
        },
      });
      mutate(null);
      toast?.show({ message: "Reported!", hideAfter: 4000 });
    },
    [toast, mutate]
  );

  return {
    report,
  };
}

export { useReport };

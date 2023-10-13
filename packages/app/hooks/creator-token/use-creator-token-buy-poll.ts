import { useState, useMemo } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { delay } from "app/utilities";

import { useStableCallback } from "../use-stable-callback";

export const useCreatorTokenBuyPoll = (param?: { onSuccess: () => void }) => {
  const [status, setStatus] = useState("idle");
  const Alert = useAlert();

  const pollBuyStatus = useStableCallback(
    async (params: {
      creator_token_id: number;
      quantity: number;
      tx_hash: string;
    }) => {
      let intervalMs = 2000;
      for (let attempts = 0; attempts < 100; attempts++) {
        Logger.log(`Checking deploy status... (${attempts + 1} / 100)`);
        const res = await axios({
          url: "/v1/creator-token/poll-buy",
          method: "POST",
          data: {
            creator_token_id: params.creator_token_id,
            quantity: params.quantity,
            tx_hash: params.tx_hash,
          },
        });

        if (res.data.status === "pending") {
          setStatus("pending");
        } else if (res.data.status === "success") {
          setStatus("success");
          param?.onSuccess();
          break;
        } else if (res.data.status === "failure") {
          setStatus("failure");
          Logger.error("Creator token deployment failure", res.data);
          Alert.alert("Creator token deployment failed");
          break;
        }

        await delay(intervalMs);
      }
    }
  );

  return useMemo(
    () => ({
      pollBuyStatus,
      status,
    }),
    [pollBuyStatus, status]
  );
};

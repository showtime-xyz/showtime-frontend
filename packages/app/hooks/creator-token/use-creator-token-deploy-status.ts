import { useState, useMemo } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { delay } from "app/utilities";

import { useStableCallback } from "../use-stable-callback";

export const useCreatorTokenDeployStatus = (param?: {
  onSuccess: () => void;
}) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "failure"
  >("idle");
  const Alert = useAlert();

  const pollDeployStatus = useStableCallback(async () => {
    setStatus("pending");
    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      await delay(intervalMs);
      Logger.log(`Checking deploy status... (${attempts + 1} / 100)`);
      try {
        const res = await axios({
          url: "/v1/creator-token/deploy/status",
          method: "GET",
        });

        if (res.is_complete) {
          setStatus("success");
          param?.onSuccess();
          break;
        } else if (res.status === "failed") {
          setStatus("failure");
          Logger.error("Creator token deployment failure", res.data);
          Alert.alert("Creator token deployment failed");
          break;
        }
      } catch (e) {
        // TODO: handle error. This is a workaround for now to handle 500 errors when the server doesnt have transaction hash
      }
    }
  });

  return useMemo(
    () => ({
      pollDeployStatus,
      status,
    }),
    [pollDeployStatus, status]
  );
};

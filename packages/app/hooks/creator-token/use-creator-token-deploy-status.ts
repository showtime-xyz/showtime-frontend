import { useState, useMemo } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { delay } from "app/utilities";

import { useStableCallback } from "../use-stable-callback";

export const useCreatorTokenDeployStatus = (param?: {
  onSuccess: () => void;
}) => {
  const [status, setStatus] = useState("idle");
  const Alert = useAlert();

  const pollDeployStatus = useStableCallback(async () => {
    let intervalMs = 2000;
    for (let attempts = 0; attempts < 100; attempts++) {
      Logger.log(`Checking deploy status... (${attempts + 1} / 100)`);
      const res = await axios({
        url: "/v1/creator-token/deploy/status",
        method: "GET",
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
  });

  return useMemo(
    () => ({
      pollDeployStatus,
      status,
    }),
    [pollDeployStatus, status]
  );
};

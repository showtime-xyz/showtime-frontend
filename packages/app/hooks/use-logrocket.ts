import { useEffect } from "react";

import LogRocket from "app/lib/logrocket";

export const useLogRocket = () => {
  useEffect(() => {
    if (process.env.STAGE !== "development") {
      LogRocket.init("oulg1q/showtime", {
        redactionTags: ["data-private"],
      });
    }
  }, []);

  return null;
};

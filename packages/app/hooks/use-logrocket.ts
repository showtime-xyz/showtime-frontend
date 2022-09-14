import { useEffect } from "react";

export const useLogRocket = () => {
  useEffect(() => {
    const init = async () => {
      const LogRocket = (await import("app/lib/logrocket")).default;

      LogRocket.init("oulg1q/showtime", {
        redactionTags: ["data-private"],
      });
    };

    if (process.env.STAGE !== "development") {
      init();
    }
  }, []);

  return null;
};

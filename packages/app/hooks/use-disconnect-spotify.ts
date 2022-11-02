import { useCallback } from "react";

import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";

export const useDisconnectSpotify = () => {
  const { mutate } = useUser();

  const disconnectSpotify = useCallback(async () => {
    await axios({
      method: "POST",
      data: {},
      url: "/v1/spotify/logout",
    });
    mutate();
  }, [mutate]);

  return { disconnectSpotify };
};

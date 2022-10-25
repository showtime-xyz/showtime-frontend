import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

type SaveSpotifyTokenParams = {
  code: string;
  redirectUri: string;
};

function useSaveSpotifyToken() {
  const { mutate } = useSWRConfig();

  const saveSpotifyToken = useCallback(
    async ({ code, redirectUri }: SaveSpotifyTokenParams) => {
      await axios({
        url: `/v1/spotify/get-and-save-token`,
        method: "POST",
        data: {
          code,
          redirect_uri: redirectUri,
        },
      });
      mutate(MY_INFO_ENDPOINT);
    },
    [mutate]
  );

  return {
    saveSpotifyToken,
  };
}

export { useSaveSpotifyToken };

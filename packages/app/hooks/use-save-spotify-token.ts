import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { useToast } from "@showtime-xyz/universal.toast";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

type SaveSpotifyTokenParams = {
  code: string;
  redirectUri: string;
};

function useSaveSpotifyToken() {
  const toast = useToast();
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
      toast?.show({ message: "Spotify token saved!", hideAfter: 4000 });
    },
    [toast, mutate]
  );

  return {
    saveSpotifyToken,
  };
}

export { useSaveSpotifyToken };

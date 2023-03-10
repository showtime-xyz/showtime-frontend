import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { useUser } from "./use-user";

type SaveSpotifyTokenParams = {
  code: string;
  redirectUri: string;
  editionAddress?: string;
};

function useSaveSpotifyToken() {
  const { mutate } = useSWRConfig();
  const { isAuthenticated } = useUser();

  const saveSpotifyToken = useCallback(
    async ({ code, redirectUri, editionAddress }: SaveSpotifyTokenParams) => {
      if (isAuthenticated) {
        await axios({
          url: `/v1/spotify/get-and-save-token`,
          method: "POST",
          data: {
            code,
            redirect_uri: redirectUri,
          },
        });
        mutate(MY_INFO_ENDPOINT);
      } else {
        await axios({
          url: `/v1/spotify/gate`,
          method: "POST",
          data: {
            code,
            redirect_uri: redirectUri,
            edition_address: editionAddress,
          },
        });
      }
    },
    [mutate, isAuthenticated]
  );

  return {
    saveSpotifyToken,
  };
}

export { useSaveSpotifyToken };

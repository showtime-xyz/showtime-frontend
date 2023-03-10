import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { useLogInPromise } from "app/lib/login-promise";

import { toast } from "design-system/toast";

import { MY_INFO_ENDPOINT } from "../providers/user-provider";
import { useGetSpotifyToken } from "./use-get-spotify-token";
import { useRedirectToClaimDrop } from "./use-redirect-to-claim-drop";
import { useSaveSpotifyToken } from "./use-save-spotify-token";

type IParams = {
  editionAddress: string;
};

export const useSpotifyPresaveUnauthenticated = () => {
  const { getSpotifyToken } = useGetSpotifyToken();
  const { loginPromise } = useLogInPromise();
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { mutate } = useSWRConfig();
  const { saveSpotifyToken } = useSaveSpotifyToken();

  const state = useSWRMutation(
    "presave-spotify-unauthenticated",
    async (key: string, values: { arg: IParams }) => {
      const editionAddress = values.arg.editionAddress;
      const res = await getSpotifyToken();
      if (res) {
        toast.success("Success. Complete your profile to collect the drop", {
          duration: 5000,
        });
        const gateRes = await axios({
          url: `/v1/spotify/gate`,
          method: "POST",
          data: {
            code: res.code,
            redirect_uri: res.redirectUri,
            edition_address: editionAddress,
          },
        });

        if (gateRes?.data) {
          await loginPromise();

          await saveSpotifyToken({
            code: res.code,
            redirectUri: res.redirectUri,
            spotifyTokenId: gateRes.data.spotify_token_id,
          });
        }

        mutate(MY_INFO_ENDPOINT);

        redirectToClaimDrop(editionAddress);
      }
      return res;
    }
  );
  return state;
};

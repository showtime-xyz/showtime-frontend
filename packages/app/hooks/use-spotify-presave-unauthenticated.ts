import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

import { useLogInPromise } from "app/lib/login-promise";

import { toast } from "design-system/toast";

import { MY_INFO_ENDPOINT } from "../providers/user-provider";
import { useConnectSpotify } from "./use-connect-spotify";
import { useRedirectToClaimDrop } from "./use-redirect-to-claim-drop";

type IParams = {
  editionAddress: string;
};

export const useSpotifyPresaveUnauthenticated = () => {
  const { connectSpotify } = useConnectSpotify();
  const { loginPromise } = useLogInPromise();
  const redirectToClaimDrop = useRedirectToClaimDrop();
  const { mutate } = useSWRConfig();

  const state = useSWRMutation(
    "presave-spotify-unauthenticated",
    async (key: string, values: { arg: IParams }) => {
      const { editionAddress } = values.arg;
      const res = await connectSpotify(editionAddress);
      if (res) {
        toast.success("Success. Complete your profile to collect the drop", {
          duration: 5000,
        });

        await loginPromise();

        if (res) {
          // await axios({
          //   url: `/v1/spotify/get-and-save-token`,
          //   method: "POST",
          //   data: {
          //     code: res.code,
          //     redirect_uri: res.redirectUri,
          //   },
          // });
          mutate(MY_INFO_ENDPOINT);

          redirectToClaimDrop(editionAddress);
        }
      }
      return res;
    }
  );
  return state;
};

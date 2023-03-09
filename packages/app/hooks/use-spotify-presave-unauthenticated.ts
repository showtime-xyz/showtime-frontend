import useSWRMutation from "swr/mutation";

import { useStableCallback } from "app/hooks/use-stable-callback";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { toast } from "design-system/toast";

import { useConnectSpotify } from "./use-connect-spotify";

type IParams = {
  editionAddress: string;
};

// const storedTokenKey = "spotify-unauthenticated-user-data";
export const useSpotifyPresaveUnauthenticated = () => {
  const { connectSpotify } = useConnectSpotify();
  const navigateToLogin = useNavigateToLogin();
  const state = useSWRMutation(
    "presave-spotify-unauthenticated",
    async (key: string, values: { arg: IParams }) => {
      const { editionAddress } = values.arg;
      const res = await connectSpotify(editionAddress);
      if (res) {
        toast.success("Success. Complete your profile to collect the drop", {
          duration: 5000,
        });
        navigateToLogin();
        // new MMKV().set(
        //   storedTokenKey,
        //   JSON.stringify({ code: res.code, redirectUri: res.redirectUri })
        // );
      }
      return res;
    }
  );
  return state;
};

export const useSavePersistedSpotifyToken = () => {
  const savePersistedSpotifyToken = useStableCallback(async () => {
    // let data = new MMKV().getString(storedTokenKey);
    // if (data) {
    //   const parsedData = JSON.parse(data);
    //   if (parsedData)
    //     await axios({
    //       url: `/v1/spotify/get-and-save-token`,
    //       method: "POST",
    //       data: {
    //         code: parsedData.code,
    //         redirect_uri: parsedData.redirectUri,
    //       },
    //     });
    //   new MMKV().delete(storedTokenKey);
    // }
  });

  return { savePersistedSpotifyToken };
};

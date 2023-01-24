import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

import { useLatestValueRef } from "./use-latest-value-ref";

type IParams = {
  releaseDate: Date;
  spotifyUrl: string;
};

export const useUpdatePresaveReleaseDate = (editionAddress?: string) => {
  // TODO: clean this up
  const editionAddressRef = useLatestValueRef(editionAddress);
  const state = useSWRMutation(
    "/v1/creator-airdrops/edition?edition_address=" + editionAddress,
    (key: string, values: { arg: IParams }) => {
      const { spotifyUrl, releaseDate } = values.arg;
      return axios({
        method: "post",
        url: `/v1/music-presave/update-music-release-track/${editionAddressRef.current}`,
        data: {
          release_date: releaseDate,
          spotify_url: spotifyUrl,
        },
      });
    }
  );

  return state;
};

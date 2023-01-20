import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

type IParams = {
  editionAddress?: string;
  releaseDate: Date;
  spotifyUrl: string;
};

export const useUpdatePresaveReleaseDate = () => {
  const state = useSWRMutation(
    "/v1/music-presave/update-music-release-track",
    (key: string, values: { arg: IParams }) => {
      const { editionAddress, spotifyUrl, releaseDate } = values.arg;
      return axios({
        method: "post",
        url: `/v1/music-presave/update-music-release-track/${editionAddress}`,
        data: {
          release_date: releaseDate,
          spotify_url: spotifyUrl,
        },
      });
    }
  );

  return state;
};

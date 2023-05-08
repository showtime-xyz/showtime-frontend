import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

import { useLatestValueRef } from "./use-latest-value-ref";

type IParams = {
  releaseDate?: Date | null;
  spotifyUrl?: string | null;
  appleMusicUrl?: string | null;
};

export const useUpdatePresaveReleaseDate = (editionAddress?: string) => {
  // TODO: clean this up
  const editionAddressRef = useLatestValueRef(editionAddress);
  const state = useSWRMutation(
    "/v1/creator-airdrops/edition?edition_address=" + editionAddress,
    (key: string, values: { arg: IParams }) => {
      const { spotifyUrl, releaseDate, appleMusicUrl } = values.arg;
      return axios({
        method: "post",
        url: `/v1/music/update-music-release-track/${editionAddressRef.current}`,
        data: {
          release_date: releaseDate,
          spotify_url: spotifyUrl,
          apple_music_url: appleMusicUrl,
        },
      });
    }
  );

  return state;
};

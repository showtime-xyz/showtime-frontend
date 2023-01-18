import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

type IParams = {
  editionAddress?: string;
  releaseDate: string;
};

export const useUpdatePresaveReleaseDate = (params: IParams) => {
  const state = useSWRMutation(
    "/api/v1/music-presave/update-music-release-track",
    () =>
      params.editionAddress
        ? axios({
            method: "post",
            url: `/api/v1/music-presave/update-music-release-track/${params.editionAddress}`,
            data: {
              release_date: params.releaseDate,
            },
          })
        : null
  );

  return state;
};

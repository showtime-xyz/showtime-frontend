import { useCallback } from "react";

import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

type Params = {
  token: string;
};

function useSaveAppleMusicToken() {
  const { mutate } = useSWRConfig();

  const saveAppleMusicToken = useCallback(
    async ({ token }: Params) => {
      await axios({
        url: `/v1/apple_music/save-token`,
        method: "POST",
        data: {
          token,
        },
      });
      mutate(MY_INFO_ENDPOINT);
    },
    [mutate]
  );

  return {
    saveAppleMusicToken,
  };
}

export { useSaveAppleMusicToken };

import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

export const useDisconnectAppleMusic = () => {
  const state = useSWRMutation(MY_INFO_ENDPOINT, () => {
    return axios({
      method: "POST",
      data: {},
      url: "/v1/apple_music/logout",
    });
  });

  return { disconnectAppleMusic: state.trigger, ...state };
};

import useSWRMutation from "swr/mutation";

import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

import { axios } from "../lib/axios";

type AddSocialType = {
  providerId: string;
};

export const useDisconnectTwitter = () => {
  const state = useSWRMutation(
    MY_INFO_ENDPOINT,
    async (key: string, values: { arg: AddSocialType }) => {
      await axios({
        url: `/v1/profile/accounts/token/twitter/${values.arg.providerId}`,
        method: "DELETE",
      });
    }
  );

  return state;
};

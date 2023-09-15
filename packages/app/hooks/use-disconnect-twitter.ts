import useSWRMutation from "swr/mutation";

import { axios } from "../lib/axios";
import { LIST_SOCIAL_ACCOUNT_CACHE_KEY } from "./use-list-social-accounts";

type AddSocialType = {
  providerId: string;
};

export const useDisconnectTwitter = () => {
  const state = useSWRMutation(
    LIST_SOCIAL_ACCOUNT_CACHE_KEY,
    async (key: string, values: { arg: AddSocialType }) => {
      await axios({
        url: `/v1/profile/accounts/token/twitter/${values.arg.providerId}`,
        method: "DELETE",
      });
    }
  );

  return state;
};

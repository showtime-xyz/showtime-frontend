import useSWR from "swr";

import { axios } from "app/lib/axios";

type Response = {
  created_at: string;
  display_name: string;
  expires_at: string;
  magic_issuer?: string;
  provider: "instagram" | "twitter";
  provider_account_id: string;
};
export const LIST_SOCIAL_ACCOUNT_CACHE_KEY = "/v1/profile/accounts/token";

export const useListSocialAccounts = () => {
  const state = useSWR<Response[]>(LIST_SOCIAL_ACCOUNT_CACHE_KEY, () => {
    return axios({
      url: "/v1/profile/accounts",
      method: "GET",
    });
  });

  return state;
};

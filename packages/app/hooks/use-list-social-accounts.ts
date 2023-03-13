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
export const useListSocialAccounts = () => {
  const state = useSWR<Response[]>("/v1/profile/accounts/token", () => {
    return axios({
      url: "/v1/profile/accounts",
      method: "GET",
    });
  });

  return state;
};

import { useCallback } from "react";

import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

type IParams = {
  email: string;
  return_url: string;
  refresh_url: string;
  country_code: string;
  business_type: "individual" | "company";
};

export const useOnBoardCreator = () => {
  const getOnboardLink = useCallback(
    async (_key: string, values: { arg: IParams }) => {
      const res = await axios({
        url: "/v1/payments/nft/payouts/account/onboard",
        method: "POST",
        data: values.arg,
      });
      return res;
    },
    []
  );

  const state = useSWRMutation(MY_INFO_ENDPOINT, getOnboardLink);

  return state;
};

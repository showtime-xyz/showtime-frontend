import { useCallback } from "react";

import useSWRMutation from "swr/mutation";

import { axios } from "app/lib/axios";

type IParams = {
  return_url: string;
  refresh_url: string;
};

export const useStripeAccountLink = () => {
  const getStripeLink = useCallback(
    async (_key: string, values: { arg: IParams }) => {
      const res = await axios({
        url: "/v1/payments/nft/payouts/account/link",
        method: "POST",
        data: values.arg,
      });
      return res;
    },
    []
  );

  const state = useSWRMutation(
    "/v1/payments/nft/payouts/account/link",
    getStripeLink
  );

  return state;
};

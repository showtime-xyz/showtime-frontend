import useSWR from "swr";

import { axios } from "app/lib/axios";

export type DropPlan = {
  name: string;
  pricing: number;
  edition_size: number;
};

export const usePaidDropPlans = () => {
  const state = useSWR<DropPlan[]>("/v1/payments/drops/plans", (url) => {
    return axios({
      method: "GET",
      url,
    });
  });

  return state;
};

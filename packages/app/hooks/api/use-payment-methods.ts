import { PaymentMethod } from "@stripe/stripe-js";
import useSWR from "swr";

import { axios } from "app/lib/axios";

const fetcher = async () => {
  return axios({
    method: "GET",
    url: "/v1/payments/methods",
  });
};
export type PaymentMethodRes = {
  id: string;
  type: string;
  details: PaymentMethod.Card;
  is_default: boolean;
};
export const usePaymentMethods = () => {
  const state = useSWR<PaymentMethodRes[]>("/v1/payments/methods", fetcher);
  return state;
};

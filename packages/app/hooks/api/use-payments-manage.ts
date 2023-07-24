import { useCallback } from "react";

import useSWR from "swr";
import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";

import { fetcher } from "../use-infinite-list-query";

export type PaymentsMethods = {
  id: string;
  type: string;
  is_default: boolean;
  details: {
    brand: string;
    last4: string;
    checks: {
      cvc_check: string;
      address_line1_check: string | null;
      address_postal_code_check: string | null;
    };
    wallet: null;
    country: string;
    funding: string;
    exp_year: number;
    networks: {
      available: Array<string>[];
      preferred: string | null;
    };
    exp_month: number;
    fingerprint: string;
    generated_from: string | null;
    three_d_secure_usage: {
      supported: boolean;
    };
  };
};
const PAYMENTS_METHODS_ENDPOINT = "";

export const usePaymentsManage = () => {
  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR<PaymentsMethods[]>(
    PAYMENTS_METHODS_ENDPOINT,
    fetcher,
    {
      keepPreviousData: false,
    }
  );

  const removePayment = async (paymentMethodId: string) => {
    mutate(PAYMENTS_METHODS_ENDPOINT, async () => {
      await axios({
        url: "/v1/payments/methods/remove",
        method: "POST",
        data: { payment_method_id: paymentMethodId },
      });
    });
  };

  const setPaymentByDefault = useCallback(
    async (paymentMethodId: string) => {
      mutate(
        PAYMENTS_METHODS_ENDPOINT,
        setPaymentByDefaultFetch(paymentMethodId)
      );
    },
    [mutate]
  );
  return { removePayment, setPaymentByDefault, data, isLoading };
};

export const setPaymentByDefaultFetch = async (paymentMethodId: string) => {
  await axios({
    url: "/v1/payments/methods/default",
    method: "POST",
    data: { payment_method_id: paymentMethodId },
  });
};

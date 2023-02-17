import useSWR from "swr";

import { fetcher } from "../use-infinite-list-query";

export type PaymentsHistory = {
  payment_intent_id: string;
  pricing_plan: string;
  amount: string;
  status: string;
  payment_method: {
    id: string;
    type: string;
    details: {
      brand: string;
      last4: string;
      checks: {
        cvc_check: string;
        address_line1_check: string | null;
        address_postal_code_check: string | null;
      };
      wallet: string | null;
      country: string;
      funding: string;
      exp_year: number;
      networks: {
        available: Array<string>;
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
  created_at: string;
  receipt_email: string;
};
export const usePaymentsHistory = () => {
  const { data, isLoading } = useSWR<PaymentsHistory[]>(
    `/v1/payments`,
    fetcher
  );
  return {
    data,
    isLoading,
  };
};

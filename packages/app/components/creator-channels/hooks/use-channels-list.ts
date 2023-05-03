import { useCallback, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";

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
  receipts: Array<string>;
};

const PAGE_SIZE = 10;

export const useChannelsList = () => {
  // TODO: add real endpoint
  const channelsFetcher = useCallback((index: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/v1/payments?page=${index + 1}&limit=${PAGE_SIZE}`;
  }, []);

  const queryState = useInfiniteListQuerySWR<PaymentsHistory[]>(
    channelsFetcher,
    {
      pageSize: PAGE_SIZE,
    }
  );
  const newData = useMemo(() => {
    let newData: PaymentsHistory[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
  };
};

import { useMemo } from "react";

import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

type PaymentSupportedCountries = {
  country_codes: {
    [key: string]: string;
  };
};

export type CountryType = {
  label: string;
  value: string;
};

export const usePaymentSupportedCountries = () => {
  const state = useSWR<PaymentSupportedCountries>(
    "/v1/payments/nft/supported-countries",
    fetcher
  );

  const countries = useMemo(() => {
    if (state.data?.country_codes) {
      return Object.keys(state.data.country_codes).map((k) => ({
        label: (state.data as any).country_codes[k],
        value: k,
      }));
    }
    return [];
  }, [state.data]);

  return { ...state, countries };
};

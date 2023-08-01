import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

type EditionPriceRange = {
  min: number;
  max: number;
  currency: string;
  default_prices: {
    first: number;
    second: number;
    third: number;
  };
};

export const usePaymentEditionPriceRange = () => {
  const state = useSWR<EditionPriceRange>(
    "/v1/payments/nft/edition-price-range",
    fetcher
  );

  return state;
};

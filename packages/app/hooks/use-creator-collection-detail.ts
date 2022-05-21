import useSWR from "swr";

import { IEdition } from "app/types";

import { fetcher } from "./use-infinite-list-query";

export function useCreatorCollectionDetail(editionAddress?: string) {
  const { data, error, mutate } = useSWR<IEdition>(
    editionAddress
      ? "/v1/creator-airdrops/edition?edition_address=" + editionAddress
      : null,
    fetcher
  );

  return {
    data,
    loading: !data,
    error,
    mutate,
  };
}

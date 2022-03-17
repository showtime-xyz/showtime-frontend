import useSWR from "swr";

import useDebounce from "app/hooks/use-debounce";
import { fetcher } from "app/hooks/use-infinite-list-query";

export type SearchResponseItem = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  img_url: string;
  address0: string;
};

type SearchResponse = {
  data: Array<SearchResponseItem>;
};

export const useSearch = (term: string) => {
  const debouncedSearch = useDebounce(term, 200);
  const { data, error } = useSWR<SearchResponse>(
    debouncedSearch ? "/v1/search?q=" + debouncedSearch : null,
    fetcher
  );

  return {
    data: data?.data,
    loading: !data,
    error,
  };
};

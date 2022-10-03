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
  results: Array<SearchResponseItem>;
};

export const useSearch = (term: string) => {
  const debouncedSearch = useDebounce(term, 200);
  const { data, error } = useSWR<SearchResponse>(
    term.length >= 2 && debouncedSearch
      ? "/v2/search?q=" + debouncedSearch
      : null,
    fetcher
  );

  return {
    data: data?.results,
    loading: !data,
    error,
  };
};

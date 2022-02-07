import useSWR from "swr";
import useDebounce from "app/hooks/use-debounce";
import { fetcher } from "app/hooks/use-infinite-list-query";

type SearchResponse = {
  data: Array<{
    id: number;
    name: string;
    username: string;
    verified: boolean;
    img_url: string;
    address0: string;
  }>;
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

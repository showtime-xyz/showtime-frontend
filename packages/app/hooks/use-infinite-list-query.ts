import { useState, useRef } from "react";

export const useInfiniteListQuery = (fetcher) => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState("");
  const page = useRef(1);

  const fetch = async () => {
    try {
      setStatus("fetching");
      setIsFetching(true);
      const body = await fetcher(page.current);
      if (page.current === 1) {
        setData(body.data);
      } else {
        setData([...data, ...body.data]);
      }
      setStatus('success')
    } catch (e) {
      setError("Something went wrong!");
      console.error(e);
      setStatus("error");
    } finally {
      setIsFetching(false);
    }
  };

  return {
    fetch,
    error,
    data,
    isLoading: data.length === 0 && isFetching,
    isRefreshing,
    isLoadingMore,
    status,
    fetchMore: async () => {
      if (!isLoadingMore) {
        setIsLoadingMore(true);
        page.current++;
        await fetch();
        setIsLoadingMore(false);
      }
    },
    refresh: async () => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        page.current = 1;
        await fetch();
        setIsRefreshing(false);
      }
    },
    retry: () => {
      fetch();
    },
  };
};

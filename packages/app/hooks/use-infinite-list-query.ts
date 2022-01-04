import { useState, useRef } from "react";

export const useInfiniteListQuery = (fetcher) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const page = useRef(1);

  const fetch = async () => {
    try {
      setIsLoading(true);
      const body = await fetcher(page.current);
      if (page.current === 1) {
        setData(body.data);
      } else {
        setData([...data, ...body.data]);
      }
    } catch (e) {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  return {
    fetch,
    error,
    data,
    isLoading: data.length === 0 && isLoading,
    isRefreshing,
    isLoadingMore: page.current > 1 && isLoading,
    fetchMore: () => {
      if (!isLoading) {
        page.current++;
        fetch();
      }
    },
    refresh: () => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        page.current = 1;
        fetch();
      }
    },
    retry: () => {
      fetch();
    },
  };
};

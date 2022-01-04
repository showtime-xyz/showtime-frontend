import { useState, useEffect, useRef } from "react";
import { axios } from "app/lib/axios";

const ACTIVITY_PAGE_LENGTH = 5; // 5 activity items per activity page

const useInfiniteListLoader = (fetcher) => {
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

export const useAllActivity = () => {
  const {
    fetch,
    data,
    error,
    fetchMore,
    isLoading,
    isLoadingMore,
    refresh,
    retry,
    isRefreshing,
  } = useInfiniteListLoader((page) => {
    const url = `/v2/activity?page=${page}&type_id=0&limit=${ACTIVITY_PAGE_LENGTH}`;

    return axios({
      url,
      method: "GET",
    });
  });

  useEffect(() => {
    fetch();
  }, []);

  return {
    data,
    error,
    fetch,
    refresh,
    fetchMore,
    retry,
    isLoading,
    isLoadingMore,
    isRefreshing,
  };
};

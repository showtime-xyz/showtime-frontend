import { useEffect } from "react";
import { axios } from "app/lib/axios";
import { useInfiniteListQuery } from "./use-infinite-list-query";

const ACTIVITY_PAGE_LENGTH = 5; // 5 activity items per activity page

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
  } = useInfiniteListQuery((page) => {
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

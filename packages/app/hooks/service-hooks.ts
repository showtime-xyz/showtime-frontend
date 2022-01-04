import { useEffect } from "react";
import { axios } from "app/lib/axios";
import { useInfiniteListQuery } from "./use-infinite-list-query";

export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
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
    const url = `/v2/activity?page=${page}&type_id=${typeId}&limit=${limit}`;
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

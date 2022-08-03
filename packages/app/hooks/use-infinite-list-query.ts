import { useState, useEffect } from "react";

import type { KeyedMutator } from "swr";
import useSWRInfinite from "swr/infinite";

import { axios } from "app/lib/axios";

export const fetcher = (url: string) => {
  return axios({ url, method: "GET" });
};

type UseInfiniteListQueryReturn<T> = {
  error?: string;
  data?: Array<T>;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  fetchMore: () => void;
  refresh: () => void;
  retry: () => void;
  mutate: KeyedMutator<T[]>;
};
type UseInfiniteListConfig = {
  refreshInterval?: number;
  pageSize?: number;
};
export const useInfiniteListQuerySWR = <T>(
  urlFunction: (pageIndex: number, previousPageData: []) => string | null,
  config?: UseInfiniteListConfig
): UseInfiniteListQueryReturn<T> => {
  const refreshInterval = config?.refreshInterval ?? 0;
  const PAGE_SIZE = config?.pageSize ?? 0;
  // Todo:: on Refresh, swr will refetch all the page APIs. This may appear weird at first, but I guess could be better for UX
  // We don't want to show loading indicator till all of the requests succeed, so we'll add our refreshing state
  // and set it to false even when first request is completed.
  const [isRefreshing, setRefreshing] = useState(false);
  const { data, error, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite<T>(urlFunction, fetcher, {
      revalidateFirstPage: true,
      // suspense: true,
      refreshInterval,
      revalidateOnMount: true,
    });

  const isRefreshingSWR = isValidating && data && data.length === size;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    (isLoadingInitialData ||
      (size > 0 && data && typeof data[size - 1] === "undefined")) ??
    false;
  const isEmpty = (data?.[0] as any)?.length === 0;

  const isReachingEnd = !PAGE_SIZE
    ? true
    : isEmpty ||
      ((data && (data[data.length - 1] as any)?.length < PAGE_SIZE) ?? true);

  useEffect(() => {
    if (!isRefreshingSWR) {
      setRefreshing(false);
    }
  }, [isRefreshingSWR]);

  const fetchMore = () => {
    if (isLoadingMore || isReachingEnd) return;
    setSize((size) => size + 1);
  };

  return {
    data,
    error,
    refresh: () => {
      setRefreshing(true);
      mutate();
      // hide refresh indicator in max 4 seconds due to above reason
      setTimeout(() => {
        setRefreshing(false);
      }, 4000);
    },
    fetchMore,
    retry: mutate,
    isLoading,
    isLoadingMore,
    isRefreshing,
    mutate,
    isReachingEnd,
  };
};

// export const useInfiniteListQuery = <T>(
//   fetcher
// ): UseInfiniteListQueryReturn<T> => {
//   const [data, setData] = useState([]);
//   const [isFetching, setIsFetching] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [status, setStatus] = useState<Status>("idle");
//   const [error, setError] = useState("");
//   const page = useRef(1);

//   const fetch = async () => {
//     try {
//       setStatus("fetching");
//       setIsFetching(true);
//       const body = await fetcher(page.current);
//       if (page.current === 1) {
//         setData(body.data);
//       } else {
//         setData([...data, ...body.data]);
//       }
//       setStatus("success");
//     } catch (e) {
//       setError("Something went wrong!");
//       console.error(e);
//       setStatus("error");
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   return {
//     fetch,
//     error,
//     data,
//     isLoading: data.length === 0 && isFetching,
//     isRefreshing,
//     isLoadingMore,
//     status,
//     fetchMore: async () => {
//       if (!isLoadingMore) {
//         setIsLoadingMore(true);
//         page.current++;
//         await fetch();
//         setIsLoadingMore(false);
//       }
//     },
//     refresh: async () => {
//       if (!isRefreshing) {
//         setIsRefreshing(true);
//         page.current = 1;
//         await fetch();
//         setIsRefreshing(false);
//       }
//     },
//     retry: fetch,
//   };
// };

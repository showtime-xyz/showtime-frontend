import { useState, useMemo, useCallback, useEffect } from "react";

import type { KeyedMutator } from "swr";
import useSWRInfinite from "swr/infinite";

import { axios } from "app/lib/axios";

export const fetcher = (url) => {
  return axios({ url, method: "GET" });
};

type UseInfiniteListQueryReturn<T> = {
  error?: string;
  data?: Array<T>;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  fetchMore: () => void;
  refresh: () => void;
  retry: () => void;
  mutate: KeyedMutator<T[]>;
};

export const useInfiniteListQuerySWR = <T>(
  urlFunction: (page: number) => string | null
): UseInfiniteListQueryReturn<T> => {
  // Todo:: on Refresh, swr will refetch all the page APIs. This may appear weird at first, but I guess could be better for UX
  // We don't want to show loading indicator till all of the requests succeed, so we'll add our refreshing state
  // and set it to false even when first request is completed.
  const [isRefreshing, setRefreshing] = useState(false);
  const {
    data: pages,
    error,
    mutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite<T>(urlFunction, fetcher, {
    revalidateFirstPage: true,
    suspense: true,
  });

  const isLoadingInitialData = !pages && !error;
  const isRefreshingSWR = isValidating && pages && pages.length === size;
  const isLoadingMore =
    size > 0 && pages && typeof pages[size - 1] === "undefined";

  useEffect(() => {
    if (!isRefreshingSWR) {
      setRefreshing(false);
    }
  }, [isRefreshingSWR]);

  return {
    data: pages,
    error,
    refresh: () => {
      setRefreshing(true);
      mutate();
      // hide refresh indicator in max 4 seconds due to above reason
      setTimeout(() => {
        setRefreshing(false);
      }, 4000);
    },
    fetchMore: useCallback(() => {
      if (!isLoadingMore) {
        setSize((size) => size + 1);
      }
    }, [isLoadingMore, setSize]),
    retry: mutate,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isRefreshing,
    mutate,
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

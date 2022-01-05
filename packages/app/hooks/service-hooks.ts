import { useEffect } from "react";
import { axios } from "app/lib/axios";
import { useInfiniteListQuery } from "./use-infinite-list-query";
// import useSWRInfinite from "swr/infinite";
// import { useInfiniteListQuery } from "./use-infinite-list-query";

// export const useActivity = ({
//   typeId,
//   limit = 5,
// }: {
//   typeId: number;
//   limit?: number;
// }) => {
//   const [isRefreshing, setRefreshing] = useState(false);
//   const {
//     data: pages,
//     error,
//     mutate,
//     size,
//     setSize,
//     isValidating,
//   } = useSWRInfinite(
//     (index) =>
//       `/v2/activity?page=${index + 1}&type_id=${typeId}&limit=${limit}`,
//     fetcher,
//     {
//       onSuccess() {
//         console.log("da mn", isRefreshing);
//         setRefreshing(false);
//       },
//     }
//   );

//   const isLoadingInitialData = !pages && !error;
//   // const isRefreshing = isValidating && pages && pages.length === size;
//   const isLoadingMore =
//     isLoadingInitialData ||
//     (size > 0 && pages && typeof pages[size - 1] === "undefined");

//   const newData = useMemo(() => {
//     let newData = [];
//     if (pages) {
//       pages.forEach((p) => {
//         if (p) {
//           newData = newData.concat(p.data);
//         }
//       });
//     }
//     return newData;
//   }, [pages]);

//   return {
//     data: newData,
//     error,
//     fetch,
//     refresh: () => {
//       if (!isRefreshing) {
//         setRefreshing(true);
//         setSize(1);
//       }
//     },
//     fetchMore: () => {
//       if (!isValidating) {
//         setSize(size + 1);
//       }
//     },
//     retry: mutate,
//     isLoading: isLoadingInitialData,
//     isLoadingMore,
//     isRefreshing,
//   };
// };

const fetcher = (url) => {
  return axios({ url, method: "GET" });
};

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
    return fetcher(url);
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

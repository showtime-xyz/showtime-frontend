import { useCallback } from "react";
import { useInfiniteListQuerySWR } from "./use-infinite-list-query";

export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
  const activityURLFn = useCallback(
    (index) => {
      const url = `/v2/activity_without_auth?page=${
        index + 1
      }&type_id=${typeId}&limit=${limit}`;
      return url;
    },
    [typeId, limit]
  );

  const queryState = useInfiniteListQuerySWR<any>(activityURLFn);
  return queryState;
};

export const useTrendingCreators = ({ days }: { days: number }) => {
  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `/v1/leaderboard?page=${index + 1}&days=${days}&limit=15`;
      return url;
    },
    [days]
  );

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn);
  return {
    ...queryState,
    fetchMore: useCallback(() => {}, []),
  };
};

export const useTrendingNFTS = ({ days }: { days: number }) => {
  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `/v2/featured?page=${index + 1}&days=${days}&limit=10`;
      return url;
    },
    [days]
  );

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn);

  return queryState;
};

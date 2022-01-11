import { useCallback } from "react";
import { useInfiniteListQuerySWR } from "./use-infinite-list-query";
import { useUser } from "./use-user";

export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
  const { isAuthenticated } = useUser();

  const activityURLFn = useCallback(
    (index) => {
      const url = `/v2/${
        isAuthenticated ? "activity_with_auth" : "activity_without_auth"
      }?page=${index + 1}&type_id=${typeId}&limit=${limit}`;
      return url;
    },
    [typeId, limit, isAuthenticated]
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

export const useComments = ({ nftId }: { nftId: number }) => {
  const commentsUrlFn = useCallback(
    (index) => {
      const url = `/v2/comments/${nftId}?limit=10`;
      return url;
    },
    [nftId]
  );

  const queryState = useInfiniteListQuerySWR<any>(commentsUrlFn);

  return queryState;
};

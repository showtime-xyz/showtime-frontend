import { Profile } from "../types";
import { useCallback } from "react";
import { NFT } from "../types";
import { useInfiniteListQuerySWR, fetcher } from "./use-infinite-list-query";
import useSWR from "swr";
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

export const useUserProfile = ({ address }: { address: string }) => {
  const trendingCreatorsUrlFn = useCallback(() => {
    const url = `/v4/profile_server?${address}`;
    return url;
  }, [address]);
  const queryState = useInfiniteListQuerySWR<UserProfile>(
    trendingCreatorsUrlFn
  );
  return queryState;
};

export interface UserProfile {
  profile: Profile;
  following_count: number;
  followers_count: number;
  featured_nft: NFT;
}

export const useCurrentUserProfile = () => {
  const { user } = useUser();

  const { data, error } = useSWR<{ data: UserProfile }>(
    user && user.data.profile && user.data.profile.wallet_addresses.length > 0
      ? "/v4/profile_server/" + user.data.profile.wallet_addresses[0]
      : null,
    fetcher
  );

  return { data, loading: !data, error };
};

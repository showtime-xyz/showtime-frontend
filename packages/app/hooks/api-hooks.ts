import { Profile } from "../types";
import { useCallback, useMemo } from "react";
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

  const newData = useMemo(() => {
    let newData = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
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

  const newData = useMemo(() => {
    let newData = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};

export const useUserProfile = ({ address }: { address: string }) => {
  const { data, error } = useSWR<{ data: UserProfile }>(
    address ? "/v4/profile_server/" + address : null,
    fetcher
  );

  return { data, loading: !data, error };
};

export interface UserProfile {
  profile: Profile;
  following_count: number;
  followers_count: number;
  featured_nft: NFT;
}

type UserProfileNFTs = {
  profileId?: number;
  listId: number;
  sortId?: number;
  showDuplicates?: number;
  showHidden?: number;
  collectionId?: number;
};

type UseProfileNFTs = {
  data: {
    items: Array<NFT>;
    hasMore: boolean;
  };
};

export const useProfileNFTs = (params: UserProfileNFTs) => {
  const {
    profileId,
    listId,
    sortId = 1,
    showDuplicates = 0,
    showHidden = 0,
    collectionId = 0,
  } = params;

  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `v1/profile_nfts?profile_id=${profileId}&page=${
        index + 1
      }&limit=${8}&list_id=${listId}&sort_id=${sortId}&show_hidden=0&show_duplicates=0&collection_id=0`;
      return url;
    },
    [profileId, listId, sortId, showDuplicates, showHidden, collectionId]
  );

  const queryState = useInfiniteListQuerySWR<UseProfileNFTs>(
    params.profileId ? trendingCreatorsUrlFn : null
  );

  const newData = useMemo(() => {
    let newData = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data.items);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  const fetchMore = () => {
    if (queryState.data?.[queryState.data.length - 1].data.hasMore) {
      queryState.fetchMore();
    }
  };

  return { ...queryState, fetchMore, data: newData };
};

type ProfileTabsAPI = {
  data: {
    default_list_id: number;
    lists: Array<{
      id: number;
      name: string;
      count_deduplicated_nonhidden: number;
      count_deduplicated_withhidden: number;
      count_all_nonhidden: number;
      count_all_withhidden: number;
      sort_id: number;
      collections: Array<{
        collection_id: number;
        collection_name: string;
        collection_img_url: string;
        count?: number;
      }>;
      has_custom_sort: boolean;
    }>;
  };
};

export const useProfileNftTabs = ({ profileId }: { profileId?: number }) => {
  const { data, error } = useSWR<ProfileTabsAPI>(
    profileId ? "/v1/profile_tabs/" + profileId : null,
    fetcher
  );

  return { data, loading: !data, error };
};

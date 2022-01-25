import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { NFT, Profile } from "../types";
import { useInfiniteListQuerySWR, fetcher } from "./use-infinite-list-query";
import { useUser } from "./use-user";
import { axios } from "app/lib/axios";
import { mixpanel } from "app/lib/mixpanel";
import { useRouter } from "app/navigation/use-router";

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
    let newData: any = [];
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
  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
    fetchMore: useCallback(() => {}, []),
  };
};

export const useTrendingNFTS = ({ days }: { days: number }) => {
  const trendingCreatorsUrlFn = useCallback(() => {
    const url = `/v2/featured?days=${days}&limit=150`;
    return url;
  }, [days]);

  const queryState = useInfiniteListQuerySWR<any>(trendingCreatorsUrlFn);
  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p.data);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  useEffect(() => {}, [queryState.data]);

  return {
    ...queryState,
    data: newData,
    fetchMore: () => {},
  };
};

export const useUserProfile = ({ address }: { address?: string }) => {
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
    has_more: boolean;
  };
};

export const defaultFilters = {
  showDuplicates: 0,
  showHidden: 0,
  collectionId: 0,
  sortId: 1,
};

export const useProfileNFTs = (params: UserProfileNFTs) => {
  const {
    profileId,
    listId,
    sortId = defaultFilters.sortId,
    showDuplicates = defaultFilters.showDuplicates,
    showHidden = defaultFilters.showHidden,
    collectionId = defaultFilters.collectionId,
  } = params;

  const trendingCreatorsUrlFn = useCallback(
    (index) => {
      const url = `v1/profile_nfts?profile_id=${profileId}&page=${
        index + 1
      }&limit=${12}&list_id=${listId}&sort_id=${sortId}&show_hidden=${showHidden}&show_duplicates=${showDuplicates}&collection_id=${collectionId}`;
      return url;
    },
    [profileId, listId, sortId, showDuplicates, showHidden, collectionId]
  );

  const queryState = useInfiniteListQuerySWR<UseProfileNFTs>(
    params.profileId ? trendingCreatorsUrlFn : null
  );

  const newData = useMemo(() => {
    let newData: NFT[] = [];
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
    if (queryState.data?.[queryState.data.length - 1].data.has_more) {
      queryState.fetchMore();
    }
  };

  return { ...queryState, fetchMore, data: newData };
};

export type Collection = {
  collection_id: number;
  collection_name: string;
  collection_img_url: string;
  count?: number;
};

export type List = {
  id: number;
  name: string;
  count_deduplicated_nonhidden: number;
  count_deduplicated_withhidden: number;
  count_all_nonhidden: number;
  count_all_withhidden: number;
  sort_id: number;
  collections: Array<Collection>;
  has_custom_sort: boolean;
};

type ProfileTabsAPI = {
  data: {
    default_list_id: number;
    lists: Array<List>;
  };
};

export const useProfileNftTabs = ({ profileId }: { profileId?: number }) => {
  const { data, error } = useSWR<ProfileTabsAPI>(
    profileId ? "/v1/profile_tabs/" + profileId : null,
    fetcher
  );

  return { data, loading: !data, error };
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

type MyInfo = {
  data: {
    follows: Array<{ profile_id: number }>;
    profile: Profile;
    likes_nft: number[];
    likes_comment: any[];
    comments: number[];
  };
};

export const useMyInfo = () => {
  const { isAuthenticated } = useUser();
  const queryKey = "/v2/myinfo";
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { data, error } = useSWR<MyInfo>(
    isAuthenticated ? queryKey : null,
    fetcher
  );

  const follow = useCallback(
    async (profileId: number) => {
      if (!isAuthenticated) {
        mixpanel.track("Follow but logged out");
        router.push("/login");
        return;
      }

      if (data) {
        mutate(
          queryKey,
          {
            data: {
              ...data.data,
              follows: [...data.data.follows, { profile_id: profileId }],
            },
          },
          false
        );

        try {
          await axios({ url: `/v2/follow/${profileId}`, method: "POST" });
          mixpanel.track("Followed profile");
        } catch (err) {
          console.error(err);
        }

        mutate(queryKey);
      }
    },
    [isAuthenticated, data]
  );

  const unfollow = useCallback(
    async (profileId: number) => {
      if (data) {
        mutate(
          queryKey,
          {
            data: {
              ...data.data,
              follows: data.data.follows.filter(
                (follow) => follow.profile_id !== profileId
              ),
            },
          },
          false
        );

        try {
          await axios({ url: `/v2/unfollow/${profileId}`, method: "POST" });
          mixpanel.track("Unfollowed profile");
        } catch (err) {
          console.error(err);
        }

        mutate(queryKey);
      }
    },
    [data]
  );

  const isFollowing = useCallback(
    (userId: number) => {
      return Boolean(
        data?.data?.follows?.find((follow) => follow.profile_id === userId)
      );
    },
    [data]
  );

  const like = useCallback(
    async (nftId: number) => {
      if (!isAuthenticated) {
        router.push("/login");
        // TODO: perform the action post login
        return false;
      }

      if (data) {
        mutate(
          queryKey,
          {
            data: {
              ...data.data,
              likes_nft: [...data.data.likes_nft, nftId],
            },
          },
          false
        );

        await axios({
          url: `/v3/like/${nftId}`,
          method: "POST",
        });

        mutate(queryKey);

        return true;
      }
    },
    [data, isAuthenticated]
  );

  const unlike = useCallback(
    async (nftId: number) => {
      if (data) {
        mutate(
          queryKey,
          {
            data: {
              ...data.data,
              likes_nft: data.data.likes_nft.filter((id) => id !== nftId),
            },
          },
          false
        );

        await axios({
          url: `/v3/unlike/${nftId}`,
          method: "POST",
        });

        mutate(queryKey);
      }
    },
    [data]
  );

  const isLiked = useCallback(
    (nftId: number) => {
      return data?.data?.likes_nft?.includes(nftId);
    },
    [data]
  );

  return {
    data,
    loading: !data,
    error,
    follow,
    unfollow,
    isFollowing,
    like,
    unlike,
    isLiked,
  };
};

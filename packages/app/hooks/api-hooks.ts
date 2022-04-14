import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import useSWR, { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { mixpanel } from "app/lib/mixpanel";
import { useRouter } from "app/navigation/use-router";

import { NFT, Profile } from "../types";
import { useAuth } from "./auth/use-auth";
import { useInfiniteListQuerySWR, fetcher } from "./use-infinite-list-query";

export const useActivity = ({
  typeId,
  limit = 5,
}: {
  typeId: number;
  limit?: number;
}) => {
  const { accessToken } = useAuth();

  const activityURLFn = useCallback(
    (index) => {
      const url = `/v2/${
        accessToken ? "activity_with_auth" : "activity_without_auth"
      }?page=${index + 1}&type_id=${typeId}&limit=${limit}`;
      return url;
    },
    [typeId, limit, accessToken]
  );

  const queryState = useInfiniteListQuerySWR<any>(activityURLFn);

  const newData = useMemo(() => {
    let newData: any = [];
    if (queryState.data) {
      // filter if duplicate data shows up in pagingation. Flatlist starts acting weird on receiving duplicates
      // It can happen if database is updating and we are fetching new data.
      // As new post shows on top, fetching next page can have same post as previous page.
      // TODO: Cursor based pagination in API?
      queryState.data.forEach((page) => {
        if (page) {
          page.data = page.data.filter((d: any) => {
            const v = newData.find((x: any) => x.id === d.id);
            if (v === undefined) {
              return true;
            }
            if (__DEV__) {
              console.log("duplicate record in feed ", d.id);
            }
            return false;
          });
          newData = newData.concat(page.data);
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
    let newData: NFT[] = [];
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
    fetchMore: () => {},
  };
};

export const USER_PROFILE_KEY = "/v4/profile_server/";
export const useUserProfile = ({ address }: { address?: string }) => {
  const { data, error } = useSWR<{ data: UserProfile }>(
    address ? USER_PROFILE_KEY + address : null,
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
  refreshInterval?: number;
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
  sortId: 2,
};

export const useProfileNFTs = (params: UserProfileNFTs) => {
  const {
    profileId,
    listId,
    sortId = defaultFilters.sortId,
    showDuplicates = defaultFilters.showDuplicates,
    showHidden = defaultFilters.showHidden,
    collectionId = defaultFilters.collectionId,
    refreshInterval,
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
    params.profileId ? trendingCreatorsUrlFn : null,
    refreshInterval
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
    blocked_profile_ids: number[];
    notifications_last_opened: string | null;
  };
};

export const useMyInfo = () => {
  const { accessToken } = useAuth();
  const queryKey = "/v2/myinfo";
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { data, error } = useSWR<MyInfo>(
    accessToken ? queryKey : null,
    fetcher
  );

  const follow = useCallback(
    async (profileId: number) => {
      if (!accessToken) {
        mixpanel.track("Follow but logged out");
        router.push(
          Platform.select({
            native: "/login",
            web: {
              pathname: router.pathname,
              query: { ...router.query, login: true },
            },
          }),
          Platform.select({
            native: "/login",
            web: router.asPath,
          }),
          { shallow: true }
        );
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
          await axios({
            url: `/v2/follow/${profileId}`,
            method: "POST",
            data: {},
          });
          mixpanel.track("Followed profile");
        } catch (err) {
          console.error(err);
        }

        mutate(queryKey);
      }
    },
    [accessToken, data, router]
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
          await axios({
            url: `/v2/unfollow/${profileId}`,
            method: "POST",
            data: {},
          });
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
      if (!accessToken) {
        router.push(
          Platform.select({
            native: "/login",
            web: {
              pathname: router.pathname,
              query: { ...router.query, login: true },
            },
          }),
          "/login",
          { shallow: true }
        );
        // TODO: perform the action post login
        return false;
      }

      if (data) {
        try {
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
            data: {},
          });

          mutate(queryKey);

          return true;
        } catch (error) {
          mutate(queryKey);
          return false;
        }
      }
    },
    [data, accessToken]
  );

  const unlike = useCallback(
    async (nftId: number) => {
      if (data) {
        try {
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
            data: {},
          });

          mutate(queryKey);
          return true;
        } catch (error) {
          mutate(queryKey);
          return false;
        }
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

  const refetchMyInfo = useCallback(() => {
    mutate(queryKey);
  }, [mutate]);

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
    refetchMyInfo,
  };
};
